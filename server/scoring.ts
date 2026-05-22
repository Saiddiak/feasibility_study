import { getDb } from './db';
import { eq, and } from 'drizzle-orm';
import { actions, posts, options, evaluationCriteria, optionScores } from '../drizzle/schema';

/**
 * Calcule le score global d'une option basé sur les scores des critères d'évaluation
 */
export async function calculateOptionGlobalScore(optionId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const scores = await db
    .select()
    .from(optionScores)
    .where(eq(optionScores.optionId, optionId));

  if (scores.length === 0) return 0;

  const criteria = await db.select().from(evaluationCriteria);
  const criteriaMap = new Map(criteria.map(c => [c.id, c]));

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const score of scores) {
    const criteria = criteriaMap.get(score.criteriaId);
    if (criteria) {
      const weight = parseFloat(criteria.weight?.toString() || '1');
      const scoreValue = parseFloat(score.score?.toString() || '0');
      totalWeightedScore += scoreValue * weight;
      totalWeight += weight;
    }
  }

  return totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100) / 100 : 0;
}

/**
 * Calcule le score global d'un poste basé sur les actions
 */
export async function calculatePostGlobalScore(postId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const postActions = await db
    .select()
    .from(actions)
    .where(eq(actions.postId, postId));

  if (postActions.length === 0) return 0;

  // Score basé sur la moyenne des coûts et l'avancement
  let totalCost = 0;
  let totalAdvancement = 0;

  for (const action of postActions) {
    totalCost += parseFloat(action.cost?.toString() || '0');
    totalAdvancement += parseFloat(action.advancement?.toString() || '0');
  }

  const avgAdvancement = totalAdvancement / postActions.length;
  return Math.round(avgAdvancement * 100) / 100;
}

/**
 * Calcule le score global d'une option basé sur les postes
 */
export async function calculateOptionAdvancement(optionId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const optionPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.optionId, optionId));

  if (optionPosts.length === 0) return 0;

  let totalAdvancement = 0;

  for (const post of optionPosts) {
    const advancement = parseFloat(post.advancement?.toString() || '0');
    totalAdvancement += advancement;
  }

  const avgAdvancement = totalAdvancement / optionPosts.length;
  return Math.round(avgAdvancement * 100) / 100;
}

/**
 * Calcule le coût total d'une option
 */
export async function calculateOptionTotalCost(optionId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const optionPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.optionId, optionId));

  let totalCost = 0;

  for (const post of optionPosts) {
    const postActions = await db
      .select()
      .from(actions)
      .where(eq(actions.postId, post.id));

    for (const action of postActions) {
      totalCost += parseFloat(action.cost?.toString() || '0');
    }
  }

  return totalCost;
}

/**
 * Calcule le délai total d'une option (en jours)
 */
export async function calculateOptionTotalDays(optionId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const optionPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.optionId, optionId));

  let totalDays = 0;

  for (const post of optionPosts) {
    const postActions = await db
      .select()
      .from(actions)
      .where(eq(actions.postId, post.id));

    for (const action of postActions) {
      totalDays += action.estimatedDays || 0;
    }
  }

  return totalDays;
}

/**
 * Évalue si une option respecte les seuils d'alerte
 */
export async function checkAlertThresholds(
  studyId: number,
  optionId: number,
  thresholds: any[]
): Promise<Array<{ thresholdId: number; triggered: boolean; value: number }>> {
  const results: Array<{ thresholdId: number; triggered: boolean; value: number }> = [];

  for (const threshold of thresholds) {
    let value = 0;
    let triggered = false;

    if (threshold.type === 'cost') {
      value = await calculateOptionTotalCost(optionId);
      triggered = compareValue(value, parseFloat(threshold.threshold), threshold.operator);
    } else if (threshold.type === 'delay') {
      value = await calculateOptionTotalDays(optionId);
      triggered = compareValue(value, parseFloat(threshold.threshold), threshold.operator);
    } else if (threshold.type === 'score') {
      value = await calculateOptionGlobalScore(optionId);
      triggered = compareValue(value, parseFloat(threshold.threshold), threshold.operator);
    } else if (threshold.type === 'advancement') {
      value = await calculateOptionAdvancement(optionId);
      triggered = compareValue(value, parseFloat(threshold.threshold), threshold.operator);
    }

    results.push({
      thresholdId: threshold.id,
      triggered,
      value,
    });
  }

  return results;
}

/**
 * Compare deux valeurs selon un opérateur
 */
function compareValue(value: number, threshold: number, operator: string): boolean {
  switch (operator) {
    case '<':
      return value < threshold;
    case '>':
      return value > threshold;
    case '<=':
      return value <= threshold;
    case '>=':
      return value >= threshold;
    case '=':
      return value === threshold;
    case '!=':
      return value !== threshold;
    default:
      return false;
  }
}

/**
 * Applique les règles de statut automatique à une option
 */
export async function applyStatusRules(optionId: number, rules: any[]): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;

  const option = await db.select().from(options).where(eq(options.id, optionId)).limit(1);
  if (option.length === 0) return null;

  for (const rule of rules) {
    if (!rule.isActive) continue;

    let conditionsMet = true;

    // Vérifier les conditions
    if (rule.conditions && typeof rule.conditions === 'object') {
      const conditions = Array.isArray(rule.conditions) ? rule.conditions : [rule.conditions];

      for (const condition of conditions) {
        let value = 0;

        if (condition.field === 'cost') {
          value = await calculateOptionTotalCost(optionId);
        } else if (condition.field === 'delay') {
          value = await calculateOptionTotalDays(optionId);
        } else if (condition.field === 'score') {
          value = await calculateOptionGlobalScore(optionId);
        } else if (condition.field === 'advancement') {
          value = await calculateOptionAdvancement(optionId);
        }

        if (!compareValue(value, parseFloat(condition.value), condition.operator)) {
          conditionsMet = false;
          break;
        }
      }
    }

    if (conditionsMet) {
      return rule.resultStatus;
    }
  }

  return null;
}
