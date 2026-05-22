import { getDb } from "./db";
import { eq, and } from "drizzle-orm";
import { options, posts, actions, statusRules, alerts, alertThresholds } from "../drizzle/schema";

/**
 * Calcule les scores d'une option basés sur ses postes et actions
 */
export async function calculateOptionScores(optionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Récupérer tous les postes de l'option
  const optionPosts = await db.select().from(posts).where(eq(posts.optionId, optionId));

  let totalCost = 0;
  let totalDays = 0;
  let totalFeasibility = 0;
  let actionCount = 0;

  // Calculer les totaux à partir des actions
  for (const post of optionPosts) {
    const postActions = await db.select().from(actions).where(eq(actions.postId, post.id));

    for (const action of postActions) {
      totalCost += Number(action.cost || 0);
      totalDays += action.estimatedDays || 0;
      totalFeasibility += Number(action.advancement || 0);
      actionCount++;
    }
  }

  // Calculer les scores (0-100)
  const costScore = Math.max(0, 100 - (totalCost / 100000) * 100); // Moins de coût = meilleur score
  const delayScore = Math.max(0, 100 - (totalDays / 365) * 100); // Moins de jours = meilleur score
  const feasibilityScore = actionCount > 0 ? totalFeasibility / actionCount : 0;

  // Calculer le score global (moyenne pondérée)
  const globalScore = (costScore * 0.3 + delayScore * 0.3 + feasibilityScore * 0.4);

  // Mettre à jour l'option
  await db.update(options).set({
    costScore: costScore.toString() as any,
    delayScore: delayScore.toString() as any,
    feasibilityScore: feasibilityScore.toString() as any,
    globalScore: globalScore.toString() as any,
    totalCost: totalCost.toString() as any,
    totalDays,
  }).where(eq(options.id, optionId));

  return {
    costScore,
    delayScore,
    feasibilityScore,
    globalScore,
    totalCost,
    totalDays,
  };
}

/**
 * Applique les règles de statut à une option
 */
export async function applyStatusRules(optionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Récupérer l'option
  const option = await db.select().from(options).where(eq(options.id, optionId)).limit(1);
  if (!option.length) throw new Error("Option not found");

  const opt = option[0];
  const studyId = opt.studyId;

  // Récupérer toutes les règles actives de l'étude
  const rules = await db
    .select()
    .from(statusRules)
    .where(and(eq(statusRules.studyId, studyId), eq(statusRules.isActive, true)))
    .orderBy(statusRules.order);

  let appliedStatus = opt.status;

  // Évaluer chaque règle
  for (const rule of rules) {
    const conditions = rule.conditions as any;
    if (evaluateConditions(conditions, opt)) {
      appliedStatus = rule.resultStatus;
      break; // Appliquer la première règle correspondante
    }
  }

  // Mettre à jour le statut
  await db.update(options).set({ status: appliedStatus }).where(eq(options.id, optionId));

  return appliedStatus;
}

/**
 * Évalue les conditions d'une règle
 */
function evaluateConditions(conditions: any, option: any): boolean {
  if (!conditions) return false;

  // Conditions simples : { field: "cost", operator: ">", value: 100000 }
  if (conditions.field && conditions.operator && conditions.value !== undefined) {
    const fieldValue = Number(option[conditions.field] || 0);
    const thresholdValue = Number(conditions.value);

    switch (conditions.operator) {
      case ">":
        return fieldValue > thresholdValue;
      case "<":
        return fieldValue < thresholdValue;
      case ">=":
        return fieldValue >= thresholdValue;
      case "<=":
        return fieldValue <= thresholdValue;
      case "=":
        return fieldValue === thresholdValue;
      case "!=":
        return fieldValue !== thresholdValue;
      default:
        return false;
    }
  }

  // Conditions composées : { logic: "AND", conditions: [...] }
  if (conditions.logic && Array.isArray(conditions.conditions)) {
    if (conditions.logic === "AND") {
      return conditions.conditions.every((cond: any) => evaluateConditions(cond, option));
    } else if (conditions.logic === "OR") {
      return conditions.conditions.some((cond: any) => evaluateConditions(cond, option));
    }
  }

  return false;
}

/**
 * Vérifie les seuils d'alertes et crée des alertes si nécessaire
 */
export async function checkAlertThresholds(optionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Récupérer l'option
  const option = await db.select().from(options).where(eq(options.id, optionId)).limit(1);
  if (!option.length) throw new Error("Option not found");

  const opt = option[0];
  const studyId = opt.studyId;

  // Récupérer tous les seuils actifs de l'étude
  const thresholds = await db
    .select()
    .from(alertThresholds)
    .where(and(eq(alertThresholds.studyId, studyId), eq(alertThresholds.isActive, true)));

  const newAlerts = [];

  for (const threshold of thresholds) {
    let fieldValue = 0;
    let alertMessage = "";

    switch (threshold.type) {
      case "cost":
        fieldValue = Number(opt.totalCost || 0);
        alertMessage = `Coût total dépassé : ${fieldValue}€ (seuil : ${threshold.threshold}€)`;
        break;
      case "delay":
        fieldValue = opt.totalDays || 0;
        alertMessage = `Délai dépassé : ${fieldValue} jours (seuil : ${threshold.threshold} jours)`;
        break;
      case "score":
        fieldValue = Number(opt.globalScore || 0);
        alertMessage = `Score insuffisant : ${fieldValue} (seuil : ${threshold.threshold})`;
        break;
      case "advancement":
        fieldValue = Number(opt.globalAdvancement || 0);
        alertMessage = `Avancement insuffisant : ${fieldValue}% (seuil : ${threshold.threshold}%)`;
        break;
      default:
        continue;
    }

    // Vérifier si le seuil est dépassé
    const thresholdValue = Number(threshold.threshold);
    let isTriggered = false;

    switch (threshold.operator) {
      case ">":
        isTriggered = fieldValue > thresholdValue;
        break;
      case "<":
        isTriggered = fieldValue < thresholdValue;
        break;
      case ">=":
        isTriggered = fieldValue >= thresholdValue;
        break;
      case "<=":
        isTriggered = fieldValue <= thresholdValue;
        break;
      case "=":
        isTriggered = fieldValue === thresholdValue;
        break;
      case "!=":
        isTriggered = fieldValue !== thresholdValue;
        break;
    }

    if (isTriggered) {
      newAlerts.push({
        studyId,
        thresholdId: threshold.id,
        title: threshold.name,
        message: alertMessage,
        severity: threshold.severity,
        relatedEntityType: "option" as const,
        relatedEntityId: optionId,
        isRead: false,
      });
    }
  }

  // Créer les alertes
  if (newAlerts.length > 0) {
    await db.insert(alerts).values(newAlerts as any);
  }

  return newAlerts;
}

/**
 * Recalcule tous les scores et règles pour une étude
 */
export async function recalculateStudyScores(studyId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Récupérer toutes les options de l'étude
  const studyOptions = await db.select().from(options).where(eq(options.studyId, studyId));

  const results = [];

  for (const option of studyOptions) {
    // Calculer les scores
    const scores = await calculateOptionScores(option.id);

    // Appliquer les règles de statut
    const status = await applyStatusRules(option.id);

    // Vérifier les seuils d'alertes
    const alerts = await checkAlertThresholds(option.id);

    results.push({
      optionId: option.id,
      scores,
      status,
      alerts,
    });
  }

  return results;
}
