import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as exportService from "./export.service";

export const exportRouter = router({
  /**
   * Générer le rapport complet en JSON
   */
  generateReport: protectedProcedure
    .input(z.object({ studyId: z.number() }))
    .query(async ({ input }) => {
      return exportService.generateStudyReport(input.studyId);
    }),

  /**
   * Générer le rapport en format Excel (CSV)
   */
  generateExcelReport: protectedProcedure
    .input(z.object({ studyId: z.number() }))
    .query(async ({ input }) => {
      const rows = await exportService.generateExcelReport(input.studyId);
      const csv = exportService.convertToCSV(rows);
      return {
        filename: `etude-faisabilite-${input.studyId}-${new Date().toISOString().split("T")[0]}.csv`,
        content: csv,
        mimeType: "text/csv",
      };
    }),

  /**
   * Générer le résumé exécutif
   */
  generateExecutiveSummary: protectedProcedure
    .input(z.object({ studyId: z.number() }))
    .query(async ({ input }) => {
      return exportService.generateExecutiveSummary(input.studyId);
    }),
});
