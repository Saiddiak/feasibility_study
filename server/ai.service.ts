import { invokeLLM } from "./_core/llm";
import * as db from "./db";

/**
 * Analyse l'étude et suggère la meilleure option
 */
export async function suggestBestOption(studyId: number): Promise<string> {
  // Mock data pour l'analyse
  const report = {
    options: [
      { name: "Option A", globalScore: 62, totalCost: 50000, totalDays: 90, status: "Risque" },
      { name: "Option B", globalScore: 78, totalCost: 75000, totalDays: 120, status: "Favorable" },
      { name: "Option C", globalScore: 58, totalCost: 40000, totalDays: 60, status: "Risque" },
    ]
  };

  const optionsDescription = report.options
    .map(
      (opt) =>
        `- ${opt.name}: Score ${Number(opt.globalScore || 0).toFixed(2)}/100, Coût ${Number(opt.totalCost || 0).toFixed(2)}€, Délai ${opt.totalDays}j, Statut: ${opt.status}`
    )
    .join("\n");

  const prompt = `Vous êtes un expert en gestion de projets et en analyse de faisabilité. 
Analysez les options suivantes et suggérez la meilleure option avec justification.

Options:
${optionsDescription}

Fournissez:
1. L'option recommandée
2. Les raisons principales
3. Les points d'attention
4. Les prochaines étapes recommandées

Répondez en français, de manière concise et professionnelle.`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "Tu es un expert en gestion de projets et en analyse de faisabilité. Fournis des recommandations claires et professionnelles.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = response.choices[0]?.message?.content || "";
  return typeof content === "string" ? content : JSON.stringify(content);
}

/**
 * Détecte les risques cachés potentiels
 */
export async function detectHiddenRisks(studyId: number): Promise<string> {
  const report = await exportService.generateStudyReport(studyId);

  const optionsDescription = report.options
    .map(
      (opt) =>
        `- ${opt.name}: ${opt.posts.length} postes, ${opt.posts.reduce((sum, p) => sum + p.actions.length, 0)} actions, Coût ${Number(opt.totalCost || 0).toFixed(2)}€`
    )
    .join("\n");

  const existingRisks = report.risks
    .map((r) => `- ${r.title}: ${r.probability}/${r.impact}`)
    .join("\n");

  const prompt = `Vous êtes un expert en gestion des risques. Analysez cette étude de faisabilité et identifiez les risques cachés potentiels.

Options:
${optionsDescription}

Risques déjà identifiés:
${existingRisks || "Aucun risque identifié"}

Identifiez:
1. Les risques potentiels non détectés
2. Les dépendances critiques
3. Les points de vulnérabilité
4. Les recommandations d'atténuation

Répondez en français, de manière structurée.`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "Tu es un expert en gestion des risques. Identifie les risques potentiels avec une analyse critique et constructive.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = response.choices[0]?.message?.content || "";
  return typeof content === "string" ? content : JSON.stringify(content);
}

/**
 * Génère un résumé exécutif par IA
 */
export async function generateAIExecutiveSummary(studyId: number): Promise<string> {
  const report = await exportService.generateStudyReport(studyId);
  const basicSummary = await exportService.generateExecutiveSummary(studyId);

  const optionsComparison = report.options
    .map(
      (opt) =>
        `${opt.name}: Score ${Number(opt.globalScore || 0).toFixed(2)}/100, Coût ${Number(opt.totalCost || 0).toFixed(2)}€, Délai ${opt.totalDays}j`
    )
    .join("\n");

  const prompt = `Basé sur cette étude de faisabilité, générez un résumé exécutif professionnel et concis.

Comparaison des options:
${optionsComparison}

Nombre de risques: ${report.risks.length}
Nombre d'alertes: ${report.alerts.length}

Générez un résumé exécutif qui:
1. Résume la situation en 2-3 phrases
2. Recommande une option avec justification
3. Identifie les 3 principaux risques
4. Propose les 3 prochaines étapes
5. Estime le niveau de confiance (%)

Répondez en français, de manière professionnelle et concise.`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "Tu es un consultant senior en gestion de projets. Génère des résumés exécutifs clairs, concis et actionnables.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = response.choices[0]?.message?.content || "";
  const aiSummary = typeof content === "string" ? content : JSON.stringify(content);

  // Sauvegarder l'analyse
  await db.createAiAnalysis(studyId, "executive_summary", aiSummary, {
    generatedAt: new Date().toISOString(),
  });

  return aiSummary;
}

/**
 * Effectue une analyse complète de l'étude
 */
export async function performFullAnalysis(studyId: number) {
  const bestOption = await suggestBestOption(studyId);
  const hiddenRisks = await detectHiddenRisks(studyId);
  const executiveSummary = await generateAIExecutiveSummary(studyId);

  return {
    bestOptionSuggestion: bestOption,
    hiddenRisks,
    executiveSummary,
    analysisDate: new Date().toISOString(),
  };
}
