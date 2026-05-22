import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ ÉTUDES ============
  studies: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getStudiesByUserId(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ studyId: z.number() }))
      .query(async ({ input }) => {
        return db.getStudyById(input.studyId);
      }),

    create: protectedProcedure
      .input(z.object({ title: z.string(), description: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const result = await db.createStudy(ctx.user.id, input.title, input.description);
        return result;
      }),

    update: protectedProcedure
      .input(z.object({ 
        studyId: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["draft", "in_progress", "completed", "archived"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { studyId, ...data } = input;
        return db.updateStudy(studyId, data);
      }),
  }),

  // ============ OPTIONS ============
  options: router({
    list: protectedProcedure
      .input(z.object({ studyId: z.number() }))
      .query(async ({ input }) => {
        return db.getOptionsByStudyId(input.studyId);
      }),

    get: protectedProcedure
      .input(z.object({ optionId: z.number() }))
      .query(async ({ input }) => {
        return db.getOptionById(input.optionId);
      }),

    create: protectedProcedure
      .input(z.object({ 
        studyId: z.number(),
        name: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createOption(input.studyId, input.name, input.description);
      }),

    update: protectedProcedure
      .input(z.object({ 
        optionId: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        globalScore: z.string().optional(),
        globalAdvancement: z.string().optional(),
        status: z.enum(["idea", "in_progress", "to_review", "in_retard", "abandoned", "terminated"]).optional(),
        order: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { optionId, ...data } = input;
        return db.updateOption(optionId, data);
      }),

    delete: protectedProcedure
      .input(z.object({ optionId: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteOption(input.optionId);
      }),
  }),

  // ============ POSTES ============
  posts: router({
    list: protectedProcedure
      .input(z.object({ optionId: z.number() }))
      .query(async ({ input }) => {
        return db.getPostsByOptionId(input.optionId);
      }),

    get: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => {
        return db.getPostById(input.postId);
      }),

    create: protectedProcedure
      .input(z.object({ 
        optionId: z.number(),
        name: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createPost(input.optionId, input.name, input.description);
      }),

    update: protectedProcedure
      .input(z.object({ 
        postId: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        globalScore: z.string().optional(),
        advancement: z.string().optional(),
        order: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { postId, ...data } = input;
        return db.updatePost(postId, data);
      }),

    delete: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(async ({ input }) => {
        return db.deletePost(input.postId);
      }),
  }),

  // ============ ACTIONS ============
  actions: router({
    list: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => {
        return db.getActionsByPostId(input.postId);
      }),

    get: protectedProcedure
      .input(z.object({ actionId: z.number() }))
      .query(async ({ input }) => {
        return db.getActionById(input.actionId);
      }),

    create: protectedProcedure
      .input(z.object({ 
        postId: z.number(),
        name: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createAction(input.postId, input.name, input.description);
      }),

    update: protectedProcedure
      .input(z.object({ 
        actionId: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["idea", "in_progress", "to_review", "in_retard", "abandoned", "terminated"]).optional(),
        advancement: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        estimatedDays: z.number().optional(),
        actualDays: z.number().optional(),
        cost: z.string().optional(),
        order: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { actionId, ...data } = input;
        return db.updateAction(actionId, data);
      }),

    delete: protectedProcedure
      .input(z.object({ actionId: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteAction(input.actionId);
      }),
  }),

  // ============ RISQUES ============
  risks: router({
    list: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => {
        return db.getRisksByPostId(input.postId);
      }),

    create: protectedProcedure
      .input(z.object({ 
        postId: z.number(),
        title: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createRisk(input.postId, input.title, input.description);
      }),

    update: protectedProcedure
      .input(z.object({ 
        riskId: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        probability: z.enum(["low", "medium", "high"]).optional(),
        impact: z.enum(["low", "medium", "high"]).optional(),
        actionPlan: z.string().optional(),
        owner: z.string().optional(),
        status: z.enum(["identified", "mitigating", "mitigated", "closed"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { riskId, ...data } = input;
        return db.updateRisk(riskId, data);
      }),
  }),

  // ============ ALERTES ============
  alerts: router({
    list: protectedProcedure
      .input(z.object({ studyId: z.number() }))
      .query(async ({ input }) => {
        return db.getAlertsByStudyId(input.studyId);
      }),

    markAsRead: protectedProcedure
      .input(z.object({ alertId: z.number() }))
      .mutation(async ({ input }) => {
        return db.markAlertAsRead(input.alertId);
      }),
  }),

  // ============ RÈGLES DE STATUT ============
  statusRules: router({
    list: protectedProcedure
      .input(z.object({ studyId: z.number() }))
      .query(async ({ input }) => {
        return db.getStatusRulesByStudyId(input.studyId);
      }),

    create: protectedProcedure
      .input(z.object({ 
        studyId: z.number(),
        name: z.string(),
        description: z.string().optional(),
        conditions: z.any(),
        resultStatus: z.enum(["idea", "in_progress", "to_review", "in_retard", "abandoned", "terminated"]),
      }))
      .mutation(async ({ input }) => {
        return db.createStatusRule(
          input.studyId,
          input.name,
          input.conditions,
          input.resultStatus,
          input.description
        );
      }),

    update: protectedProcedure
      .input(z.object({ 
        ruleId: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        conditions: z.any().optional(),
        resultStatus: z.enum(["idea", "in_progress", "to_review", "in_retard", "abandoned", "terminated"]).optional(),
        isActive: z.boolean().optional(),
        order: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { ruleId, ...data } = input;
        return db.updateStatusRule(ruleId, data);
      }),
  }),

  // ============ SEUILS D'ALERTES ============
  alertThresholds: router({
    list: protectedProcedure
      .input(z.object({ studyId: z.number() }))
      .query(async ({ input }) => {
        return db.getAlertThresholdsByStudyId(input.studyId);
      }),

    create: protectedProcedure
      .input(z.object({ 
        studyId: z.number(),
        name: z.string(),
        type: z.enum(["cost", "delay", "score", "advancement"]),
        operator: z.enum(["<", ">", "<=", ">=", "=", "!="]),
        threshold: z.number(),
        severity: z.enum(["info", "warning", "critical"]),
      }))
      .mutation(async ({ input }) => {
        return db.createAlertThreshold(
          input.studyId,
          input.name,
          input.type,
          input.operator,
          input.threshold,
          input.severity
        );
      }),
  }),

  // ============ CRITÈRES D'ÉVALUATION ============
  evaluationCriteria: router({
    list: protectedProcedure
      .input(z.object({ studyId: z.number() }))
      .query(async ({ input }) => {
        return db.getEvaluationCriteriaByStudyId(input.studyId);
      }),

    create: protectedProcedure
      .input(z.object({ 
        studyId: z.number(),
        name: z.string(),
        description: z.string().optional(),
        weight: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createEvaluationCriteria(
          input.studyId,
          input.name,
          input.weight || 1,
          input.description
        );
      }),
  }),

  // ============ ANALYSES IA ============
  aiAnalyses: router({
    create: protectedProcedure
      .input(z.object({ 
        studyId: z.number(),
        type: z.enum(["executive_summary", "best_option_suggestion", "risk_detection", "full_analysis"]),
        content: z.string(),
        metadata: z.any().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createAiAnalysis(input.studyId, input.type, input.content, input.metadata);
      }),

    getLatestByType: protectedProcedure
      .input(z.object({ 
        studyId: z.number(),
        type: z.string(),
      }))
      .query(async ({ input }) => {
        return db.getLatestAiAnalysisByType(input.studyId, input.type);
      }),
  }),
});

export type AppRouter = typeof appRouter;
