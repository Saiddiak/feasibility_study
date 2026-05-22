import { router, protectedProcedure } from './_core/trpc';
import { z } from 'zod';
import * as db from './db';
import * as scoring from './scoring';

export const scoringRouter = router({
  // Calculs de scores
  calculateOptionScore: protectedProcedure
    .input(z.object({ optionId: z.number() }))
    .query(async ({ input }) => {
      const score = await scoring.calculateOptionGlobalScore(input.optionId);
      return { score };
    }),

  calculateOptionAdvancement: protectedProcedure
    .input(z.object({ optionId: z.number() }))
    .query(async ({ input }) => {
      const advancement = await scoring.calculateOptionAdvancement(input.optionId);
      return { advancement };
    }),

  calculateOptionTotalCost: protectedProcedure
    .input(z.object({ optionId: z.number() }))
    .query(async ({ input }) => {
      const cost = await scoring.calculateOptionTotalCost(input.optionId);
      return { cost };
    }),

  calculateOptionTotalDays: protectedProcedure
    .input(z.object({ optionId: z.number() }))
    .query(async ({ input }) => {
      const days = await scoring.calculateOptionTotalDays(input.optionId);
      return { days };
    }),

  // Vérification des seuils d'alerte
  checkAlertThresholds: protectedProcedure
    .input(z.object({ 
      studyId: z.number(),
      optionId: z.number(),
    }))
    .query(async ({ input }) => {
      const thresholds = await db.getAlertThresholdsByStudyId(input.studyId);
      const results = await scoring.checkAlertThresholds(input.studyId, input.optionId, thresholds);
      
      // Créer les alertes déclenchées
      for (const result of results) {
        if (result.triggered) {
          const threshold = thresholds.find((t: any) => t.id === result.thresholdId);
          if (threshold) {
            await db.createAlert({
              studyId: input.studyId,
              thresholdId: result.thresholdId,
              title: `Seuil d'alerte dépassé: ${threshold.name}`,
              message: `La valeur ${result.value} dépasse le seuil ${threshold.threshold}`,
              severity: threshold.severity,
              relatedEntityType: 'option' as const,
              relatedEntityId: input.optionId,
            });
          }
        }
      }

      return results;
    }),

  // Application des règles de statut
  applyStatusRules: protectedProcedure
    .input(z.object({ 
      studyId: z.number(),
      optionId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const rules = await db.getStatusRulesByStudyId(input.studyId);
      const newStatus = await scoring.applyStatusRules(input.optionId, rules);
      
      if (newStatus) {
        await db.updateOption(input.optionId, { status: newStatus as any });
        return { newStatus };
      }

      return { newStatus: null };
    }),

  // Recalculer tous les scores d'une étude
  recalculateStudyScores: protectedProcedure
    .input(z.object({ studyId: z.number() }))
    .mutation(async ({ input }) => {
      const optionsList = await db.getOptionsByStudyId(input.studyId);
      const results = [];

      for (const option of optionsList) {
        const score = await scoring.calculateOptionGlobalScore(option.id);
        const advancement = await scoring.calculateOptionAdvancement(option.id);
        const cost = await scoring.calculateOptionTotalCost(option.id);
        const days = await scoring.calculateOptionTotalDays(option.id);

        await db.updateOption(option.id, {
          globalScore: score.toString(),
          globalAdvancement: advancement.toString(),
        });

        results.push({
          optionId: option.id,
          score,
          advancement,
          cost,
          days,
        });
      }

      return results;
    }),
});
