import { 
  int, 
  mysqlEnum, 
  mysqlTable, 
  text, 
  timestamp, 
  varchar,
  decimal,
  boolean,
  json,
  uniqueIndex,
  index
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Études de faisabilité - conteneur principal
 */
export const studies = mysqlTable("studies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["draft", "in_progress", "completed", "archived"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdIdx: index("studies_userId_idx").on(table.userId),
}));

export type Study = typeof studies.$inferSelect;
export type InsertStudy = typeof studies.$inferInsert;

/**
 * Options (solutions alternatives)
 */
export const options = mysqlTable("options", {
  id: int("id").autoincrement().primaryKey(),
  studyId: int("studyId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  globalScore: decimal("globalScore", { precision: 5, scale: 2 }).default("0"),
  globalAdvancement: decimal("globalAdvancement", { precision: 5, scale: 2 }).default("0"),
  status: mysqlEnum("status", ["idea", "in_progress", "to_review", "in_retard", "abandoned", "terminated"]).default("idea").notNull(),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  studyIdIdx: index("options_studyId_idx").on(table.studyId),
}));

export type Option = typeof options.$inferSelect;
export type InsertOption = typeof options.$inferInsert;

/**
 * Postes (phases/étapes dans une option)
 */
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  optionId: int("optionId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  globalScore: decimal("globalScore", { precision: 5, scale: 2 }).default("0"),
  advancement: decimal("advancement", { precision: 5, scale: 2 }).default("0"),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  optionIdIdx: index("posts_optionId_idx").on(table.optionId),
}));

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

/**
 * Actions (tâches détaillées dans un poste)
 */
export const actions = mysqlTable("actions", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["idea", "in_progress", "to_review", "in_retard", "abandoned", "terminated"]).default("idea").notNull(),
  advancement: decimal("advancement", { precision: 5, scale: 2 }).default("0"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  estimatedDays: int("estimatedDays").default(0),
  actualDays: int("actualDays"),
  cost: decimal("cost", { precision: 12, scale: 2 }).default("0"),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  postIdIdx: index("actions_postId_idx").on(table.postId),
}));

export type Action = typeof actions.$inferSelect;
export type InsertAction = typeof actions.$inferInsert;

/**
 * Risques (identification et gestion des risques)
 */
export const risks = mysqlTable("risks", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  probability: mysqlEnum("probability", ["low", "medium", "high"]).default("medium").notNull(),
  impact: mysqlEnum("impact", ["low", "medium", "high"]).default("medium").notNull(),
  actionPlan: text("actionPlan"),
  owner: varchar("owner", { length: 255 }),
  status: mysqlEnum("status", ["identified", "mitigating", "mitigated", "closed"]).default("identified").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  postIdIdx: index("risks_postId_idx").on(table.postId),
}));

export type Risk = typeof risks.$inferSelect;
export type InsertRisk = typeof risks.$inferInsert;

/**
 * Règles de statut dynamique (configurables par utilisateur)
 */
export const statusRules = mysqlTable("statusRules", {
  id: int("id").autoincrement().primaryKey(),
  studyId: int("studyId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  // Conditions JSON: { field: "cost", operator: ">", value: 100000 }
  conditions: json("conditions").notNull(),
  resultStatus: mysqlEnum("resultStatus", ["idea", "in_progress", "to_review", "in_retard", "abandoned", "terminated"]).notNull(),
  isActive: boolean("isActive").default(true),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  studyIdIdx: index("statusRules_studyId_idx").on(table.studyId),
}));

export type StatusRule = typeof statusRules.$inferSelect;
export type InsertStatusRule = typeof statusRules.$inferInsert;

/**
 * Seuils d'alertes (configurables par utilisateur)
 */
export const alertThresholds = mysqlTable("alertThresholds", {
  id: int("id").autoincrement().primaryKey(),
  studyId: int("studyId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["cost", "delay", "score", "advancement"]).notNull(),
  operator: mysqlEnum("operator", ["<", ">", "<=", ">=", "=", "!="]).notNull(),
  threshold: decimal("threshold", { precision: 12, scale: 2 }).notNull(),
  severity: mysqlEnum("severity", ["info", "warning", "critical"]).default("warning").notNull(),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  studyIdIdx: index("alertThresholds_studyId_idx").on(table.studyId),
}));

export type AlertThreshold = typeof alertThresholds.$inferSelect;
export type InsertAlertThreshold = typeof alertThresholds.$inferInsert;

/**
 * Alertes générées (notifications)
 */
export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  studyId: int("studyId").notNull(),
  thresholdId: int("thresholdId"),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  severity: mysqlEnum("severity", ["info", "warning", "critical"]).default("warning").notNull(),
  relatedEntityType: mysqlEnum("relatedEntityType", ["option", "post", "action"]).notNull(),
  relatedEntityId: int("relatedEntityId").notNull(),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  studyIdIdx: index("alerts_studyId_idx").on(table.studyId),
  thresholdIdIdx: index("alerts_thresholdId_idx").on(table.thresholdId),
}));

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;

/**
 * Critères d'évaluation pondérés pour la matrice de comparaison
 */
export const evaluationCriteria = mysqlTable("evaluationCriteria", {
  id: int("id").autoincrement().primaryKey(),
  studyId: int("studyId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  weight: decimal("weight", { precision: 5, scale: 2 }).default("1"),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  studyIdIdx: index("evaluationCriteria_studyId_idx").on(table.studyId),
}));

export type EvaluationCriteria = typeof evaluationCriteria.$inferSelect;
export type InsertEvaluationCriteria = typeof evaluationCriteria.$inferInsert;

/**
 * Scores des options selon les critères
 */
export const optionScores = mysqlTable("optionScores", {
  id: int("id").autoincrement().primaryKey(),
  optionId: int("optionId").notNull(),
  criteriaId: int("criteriaId").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  optionIdIdx: index("optionScores_optionId_idx").on(table.optionId),
  criteriaIdIdx: index("optionScores_criteriaId_idx").on(table.criteriaId),
}));

export type OptionScore = typeof optionScores.$inferSelect;
export type InsertOptionScore = typeof optionScores.$inferInsert;

/**
 * Jalons (milestones) pour la chronologie
 */
export const milestones = mysqlTable("milestones", {
  id: int("id").autoincrement().primaryKey(),
  studyId: int("studyId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: timestamp("dueDate").notNull(),
  status: mysqlEnum("status", ["planned", "in_progress", "completed", "delayed"]).default("planned").notNull(),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  studyIdIdx: index("milestones_studyId_idx").on(table.studyId),
}));

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = typeof milestones.$inferInsert;

/**
 * Dépendances entre actions
 */
export const actionDependencies = mysqlTable("actionDependencies", {
  id: int("id").autoincrement().primaryKey(),
  actionId: int("actionId").notNull(),
  dependsOnActionId: int("dependsOnActionId").notNull(),
  dependencyType: mysqlEnum("dependencyType", ["finish_to_start", "start_to_start", "finish_to_finish", "start_to_finish"]).default("finish_to_start").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  actionIdIdx: index("actionDependencies_actionId_idx").on(table.actionId),
  dependsOnActionIdIdx: index("actionDependencies_dependsOnActionId_idx").on(table.dependsOnActionId),
}));

export type ActionDependency = typeof actionDependencies.$inferSelect;
export type InsertActionDependency = typeof actionDependencies.$inferInsert;

/**
 * Analyses IA (résumés, suggestions, détections de risques)
 */
export const aiAnalyses = mysqlTable("aiAnalyses", {
  id: int("id").autoincrement().primaryKey(),
  studyId: int("studyId").notNull(),
  type: mysqlEnum("type", ["executive_summary", "best_option_suggestion", "risk_detection", "full_analysis"]).notNull(),
  content: text("content").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  studyIdIdx: index("aiAnalyses_studyId_idx").on(table.studyId),
}));

export type AiAnalysis = typeof aiAnalyses.$inferSelect;
export type InsertAiAnalysis = typeof aiAnalyses.$inferInsert;
