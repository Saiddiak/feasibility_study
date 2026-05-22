import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as aiService from "./ai.service";

export const aiRouter = router({
  /**
   * Suggérer la meilleure option
   */
  suggestBestOption: protectedProcedure
    .input(z.object({ studyId: z.number() }))
    .mutation(async ({ input }) => {
      return aiService.suggestBestOption(input.studyId);
    }),

  /**
   * Détecter les risques cachés
   */
  detectHiddenRisks: protectedProcedure
    .input(z.object({ studyId: z.number() }))
    .mutation(async ({ input }) => {
      return aiService.detectHiddenRisks(input.studyId);
    }),

  /**
   * Générer un résumé exécutif par IA
   */
  generateExecutiveSummary: protectedProcedure
    .input(z.object({ studyId: z.number() }))
    .mutation(async ({ input }) => {
      return aiService.generateAIExecutiveSummary(input.studyId);
    }),

  /**
   * Effectuer une analyse complète
   */
  performFullAnalysis: protectedProcedure
    .input(z.object({ studyId: z.number() }))
    .mutation(async ({ input }) => {
      return aiService.performFullAnalysis(input.studyId);
    }),
});
