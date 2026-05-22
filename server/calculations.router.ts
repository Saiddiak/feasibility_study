import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as calculations from "./calculations";
import * as db from "./db";
import { getDb } from "./db";


export const calculationsRouter = router({
  /**
   * Recalculer les scores d'une option
   */
  recalculateOptionScores: protectedProcedure
    .input(z.object({ optionId: z.number() }))
    .mutation(async ({ input }) => {
      return calculations.calculateOptionScores(input.optionId);
    }),

  /**
   * Appliquer les règles de statut à une option
   */
  applyStatusRules: protectedProcedure
    .input(z.object({ optionId: z.number() }))
    .mutation(async ({ input }) => {
      return calculations.applyStatusRules(input.optionId);
    }),

  /**
   * Vérifier les seuils d'alertes pour une option
   */
  checkAlertThresholds: protectedProcedure
    .input(z.object({ optionId: z.number() }))
    .mutation(async ({ input }) => {
      return calculations.checkAlertThresholds(input.optionId);
    }),

  /**
   * Recalculer tous les scores d'une étude
   */
  recalculateStudy: protectedProcedure
    .input(z.object({ studyId: z.number() }))
    .mutation(async ({ input }) => {
      return calculations.recalculateStudyScores(input.studyId);
    }),

  /**
   * Récupérer les règles de statut d'une étude
   */
  getStatusRules: protectedProcedure
    .input(z.object({ studyId: z.number() }))
    .query(async ({ input }) => {
      return db.getStatusRulesByStudyId(input.studyId);
    }),

  /**
   * Créer une règle de statut
   */
  createStatusRule: protectedProcedure
    .input(z.object({
      studyId: z.number(),
      name: z.string(),
      description: z.string().optional(),
      conditions: z.any(), // JSON conditions
      resultStatus: z.enum(["idea", "in_progress", "to_review", "in_retard", "abandoned", "terminated", "favorable", "risky", "blocked"]),
      order: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createStatusRule(input.studyId, input.name, input.conditions, input.resultStatus, input.description);
    }),

  /**
   * Mettre à jour une règle de statut
   */
  updateStatusRule: protectedProcedure
    .input(z.object({
      ruleId: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      conditions: z.any().optional(),
      resultStatus: z.enum(["idea", "in_progress", "to_review", "in_retard", "abandoned", "terminated", "favorable", "risky", "blocked"]).optional(),
      isActive: z.boolean().optional(),
      order: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { ruleId, ...data } = input;
      return db.updateStatusRule(ruleId, data as any);
    }),

  /**
   * Supprimer une règle de statut
   */
  deleteStatusRule: protectedProcedure
    .input(z.object({ ruleId: z.number() }))
    .mutation(async ({ input }) => {
      return db.deleteStatusRule(input.ruleId);
    }),

  /**
   * Récupérer les seuils d'alertes d'une étude
   */
  getAlertThresholds: protectedProcedure
    .input(z.object({ studyId: z.number() }))
    .query(async ({ input }) => {
      return db.getAlertThresholdsByStudyId(input.studyId);
    }),

  /**
   * Créer un seuil d'alerte
   */
  createAlertThreshold: protectedProcedure
    .input(z.object({
      studyId: z.number(),
      name: z.string(),
      type: z.enum(["cost", "delay", "score", "advancement"]),
      operator: z.enum(["<", ">", "<=", ">=", "=", "!="]),
      threshold: z.number(),
      severity: z.enum(["info", "warning", "critical"]).optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createAlertThreshold(input.studyId, input.name, input.type, input.operator, input.threshold, input.severity || "warning");
    }),

  /**
   * Mettre à jour un seuil d'alerte
   */
  updateAlertThreshold: protectedProcedure
    .input(z.object({
      thresholdId: z.number(),
      name: z.string().optional(),
      type: z.enum(["cost", "delay", "score", "advancement"]).optional(),
      operator: z.enum(["<", ">", "<=", ">=", "=", "!="]).optional(),
      threshold: z.number().optional(),
      severity: z.enum(["info", "warning", "critical"]).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { thresholdId, ...data } = input;
      return db.updateAlertThresholdFn(thresholdId, data as any);
    }),

  /**
   * Supprimer un seuil d'alerte
   */
  deleteAlertThreshold: protectedProcedure
    .input(z.object({ thresholdId: z.number() }))
    .mutation(async ({ input }) => {
      return db.deleteAlertThresholdFn(input.thresholdId);
    }),
});
