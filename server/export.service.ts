import { getDb } from "./db";
import { eq } from "drizzle-orm";
import { studies, options, posts, actions, risks, alerts } from "../drizzle/schema";

/**
 * Génère un rapport JSON complet de l'étude de faisabilité
 */
export async function generateStudyReport(studyId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Récupérer l'étude
  const study = await db.select().from(studies).where(eq(studies.id, studyId)).limit(1);
  if (!study.length) throw new Error("Study not found");

  // Récupérer toutes les options
  const studyOptions = await db.select().from(options).where(eq(options.studyId, studyId));

  // Récupérer tous les postes et actions
  const optionsWithDetails = await Promise.all(
    studyOptions.map(async (option) => {
      const optionPosts = await db.select().from(posts).where(eq(posts.optionId, option.id));

      const postsWithActions = await Promise.all(
        optionPosts.map(async (post) => {
          const postActions = await db.select().from(actions).where(eq(actions.postId, post.id));
          return { ...post, actions: postActions };
        })
      );

      return { ...option, posts: postsWithActions };
    })
  );

  // Récupérer les risques
  const studyRisks = await db.select().from(risks).where(eq(risks.studyId, studyId));

  // Récupérer les alertes
  const studyAlerts = await db.select().from(alerts).where(eq(alerts.studyId, studyId));

  return {
    study: study[0],
    options: optionsWithDetails,
    risks: studyRisks,
    alerts: studyAlerts,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Formate le rapport pour l'export CSV/Excel
 */
export async function generateExcelReport(studyId: number) {
  const report = await generateStudyReport(studyId);

  const rows: string[][] = [];

  // En-tête
  rows.push(["ÉTUDE DE FAISABILITÉ - RAPPORT COMPLET"]);
  rows.push([]);
  rows.push([`Étude: ${report.study.title}`]);
  rows.push([`Date: ${new Date(report.generatedAt).toLocaleDateString("fr-FR")}`]);
  rows.push([]);

  // Résumé des options
  rows.push(["RÉSUMÉ DES OPTIONS"]);
  rows.push(["Nom", "Score Global", "Coût Total", "Délai (jours)", "Statut", "Avancement"]);

  for (const option of report.options) {
    rows.push([
      option.name,
      String(option.globalScore || 0),
      String(option.totalCost || 0),
      String(option.totalDays || 0),
      option.status,
      String(option.globalAdvancement || 0),
    ]);
  }

  rows.push([]);

  // Détail par option
  for (const option of report.options) {
    rows.push([`OPTION: ${option.name}`]);
    rows.push(["Description", option.description || ""]);
    rows.push([]);

    for (const post of option.posts) {
      rows.push([`  Poste: ${post.name}`]);
      rows.push(["    Action", "Statut", "Avancement", "Coût", "Jours"]);

      for (const action of post.actions) {
        rows.push([
          `    ${action.name}`,
          action.status,
          String(action.advancement || 0),
          String(action.cost || 0),
          String(action.estimatedDays || 0),
        ]);
      }

      rows.push([]);
    }

    rows.push([]);
  }

  // Risques
  rows.push(["RISQUES IDENTIFIÉS"]);
  rows.push(["Titre", "Description", "Probabilité", "Impact", "Statut", "Plan d'action"]);

  for (const risk of report.risks) {
    rows.push([
      risk.title,
      risk.description || "",
      risk.probability,
      risk.impact,
      risk.status,
      risk.actionPlan || "",
    ]);
  }

  rows.push([]);

  // Alertes
  rows.push(["ALERTES"]);
  rows.push(["Titre", "Message", "Sévérité", "Date"]);

  for (const alert of report.alerts) {
    rows.push([
      alert.title,
      alert.message,
      alert.severity,
      new Date(alert.createdAt).toLocaleDateString("fr-FR"),
    ]);
  }

  return rows;
}

/**
 * Convertit les données en format CSV
 */
export function convertToCSV(rows: string[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          // Échapper les guillemets et entourer de guillemets si nécessaire
          const escaped = String(cell).replace(/"/g, '""');
          return escaped.includes(",") || escaped.includes('"') || escaped.includes("\n")
            ? `"${escaped}"`
            : escaped;
        })
        .join(",")
    )
    .join("\n");
}

/**
 * Génère un résumé exécutif en texte
 */
export async function generateExecutiveSummary(studyId: number): Promise<string> {
  const report = await generateStudyReport(studyId);

  const study = report.study;
  const options = report.options;
  const risks = report.risks;

  // Trouver la meilleure option
  const bestOption = options.reduce((best, current) => {
    const bestScore = Number(best.globalScore || 0);
    const currentScore = Number(current.globalScore || 0);
    return currentScore > bestScore ? current : best;
  });

  // Compter les risques par niveau
  const criticalRisks = risks.filter(
    (r) => (r.probability === "high" && r.impact === "high") || r.impact === "high"
  ).length;
  const mediumRisks = risks.filter(
    (r) =>
      (r.probability === "medium" && r.impact === "medium") ||
      (r.probability === "high" && r.impact === "medium") ||
      (r.probability === "medium" && r.impact === "high")
  ).length;

  let summary = `# RÉSUMÉ EXÉCUTIF - ÉTUDE DE FAISABILITÉ\n\n`;
  summary += `## Étude: ${study.title}\n`;
  summary += `Date: ${new Date().toLocaleDateString("fr-FR")}\n\n`;

  summary += `## Recommandation\n`;
  summary += `**Option recommandée: ${bestOption.name}**\n`;
  summary += `- Score global: ${Number(bestOption.globalScore || 0).toFixed(2)}/100\n`;
  summary += `- Coût estimé: ${Number(bestOption.totalCost || 0).toFixed(2)}€\n`;
  summary += `- Délai: ${bestOption.totalDays} jours\n`;
  summary += `- Statut: ${bestOption.status}\n\n`;

  summary += `## Comparaison des options\n`;
  for (const option of options) {
    summary += `- **${option.name}**: Score ${Number(option.globalScore || 0).toFixed(2)}/100, Coût ${Number(option.totalCost || 0).toFixed(2)}€, Délai ${option.totalDays}j\n`;
  }

  summary += `\n## Risques identifiés\n`;
  summary += `- Risques critiques: ${criticalRisks}\n`;
  summary += `- Risques moyens: ${mediumRisks}\n`;
  summary += `- Risques faibles: ${risks.length - criticalRisks - mediumRisks}\n\n`;

  if (criticalRisks > 0) {
    summary += `**⚠️ Attention**: ${criticalRisks} risque(s) critique(s) identifié(s). Une attention particulière est requise.\n\n`;
  }

  summary += `## Prochaines étapes\n`;
  summary += `1. Valider la recommandation avec les parties prenantes\n`;
  summary += `2. Développer les plans d'atténuation des risques\n`;
  summary += `3. Planifier l'implémentation détaillée\n`;
  summary += `4. Allouer les ressources nécessaires\n`;

  return summary;
}
