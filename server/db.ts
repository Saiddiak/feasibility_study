import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";
import { studies, options, posts, actions, risks, alerts, milestones, evaluationCriteria, optionScores } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

let db: any = null;

export async function getDb() {
  if (db) return db;
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  db = drizzle(connection, { schema, mode: "default" });
  return db;
}

/**
 * Studies queries
 */
export async function getStudyById(studyId: number) {
  const database = await getDb();
  return database.query.studies.findFirst({
    where: eq(studies.id, studyId),
  });
}

export async function getStudiesByUserId(userId: number) {
  const database = await getDb();
  return database.query.studies.findMany({
    where: eq(studies.userId, userId),
    orderBy: desc(studies.createdAt),
  });
}

/**
 * Options queries
 */
export async function getOptionsByStudyId(studyId: number) {
  const database = await getDb();
  return database.query.options.findMany({
    where: eq(options.studyId, studyId),
    orderBy: options.order,
  });
}

/**
 * Posts queries
 */
export async function getPostsByOptionId(optionId: number) {
  const database = await getDb();
  return database.query.posts.findMany({
    where: eq(posts.optionId, optionId),
    orderBy: posts.order,
  });
}

/**
 * Actions queries
 */
export async function getActionsByPostId(postId: number) {
  const database = await getDb();
  return database.query.actions.findMany({
    where: eq(actions.postId, postId),
    orderBy: actions.order,
  });
}

/**
 * Risks queries
 */
export async function getRisksByStudyId(studyId: number) {
  const database = await getDb();
  return database.query.risks.findMany({
    where: eq(risks.studyId, studyId),
  });
}

/**
 * Alerts queries
 */
export async function getAlertsByStudyId(studyId: number) {
  const database = await getDb();
  return database.query.alerts.findMany({
    where: eq(alerts.studyId, studyId),
    orderBy: desc(alerts.createdAt),
  });
}

/**
 * Milestones queries
 */
export async function getMilestonesByStudyId(studyId: number) {
  const database = await getDb();
  return database.query.milestones.findMany({
    where: eq(milestones.studyId, studyId),
    orderBy: milestones.dueDate,
  });
}

/**
 * Create/Update/Delete operations
 */
export async function createStudy(userId: number, title: string, description?: string) {
  const database = await getDb();
  return database.insert(studies).values({
    userId,
    title,
    description,
    status: "draft",
  });
}

export async function updateStudy(studyId: number, data: any) {
  const database = await getDb();
  return database.update(studies).set(data).where(eq(studies.id, studyId));
}

export async function getOptionById(optionId: number) {
  const database = await getDb();
  return database.query.options.findFirst({
    where: eq(options.id, optionId),
  });
}

export async function createOption(studyId: number, name: string, description?: string) {
  const database = await getDb();
  return database.insert(options).values({
    studyId,
    name,
    description,
    status: "idea",
  });
}

export async function updateOption(optionId: number, data: any) {
  const database = await getDb();
  return database.update(options).set(data).where(eq(options.id, optionId));
}

export async function deleteOption(optionId: number) {
  const database = await getDb();
  return database.delete(options).where(eq(options.id, optionId));
}

export async function getPostById(postId: number) {
  const database = await getDb();
  return database.query.posts.findFirst({
    where: eq(posts.id, postId),
  });
}

export async function createPost(optionId: number, name: string, description?: string) {
  const database = await getDb();
  return database.insert(posts).values({
    optionId,
    name,
    description,
  });
}

export async function updatePost(postId: number, data: any) {
  const database = await getDb();
  return database.update(posts).set(data).where(eq(posts.id, postId));
}

export async function deletePost(postId: number) {
  const database = await getDb();
  return database.delete(posts).where(eq(posts.id, postId));
}

export async function getActionById(actionId: number) {
  const database = await getDb();
  return database.query.actions.findFirst({
    where: eq(actions.id, actionId),
  });
}

export async function createAction(postId: number, name: string, description?: string) {
  const database = await getDb();
  return database.insert(actions).values({
    postId,
    name,
    description,
    status: "idea",
  });
}

export async function updateAction(actionId: number, data: any) {
  const database = await getDb();
  return database.update(actions).set(data).where(eq(actions.id, actionId));
}

export async function deleteAction(actionId: number) {
  const database = await getDb();
  return database.delete(actions).where(eq(actions.id, actionId));
}

export async function getEvaluationCriteriaByStudyId(studyId: number) {
  return [];
}

export async function createEvaluationCriteria(studyId: number, name: string, weight: number, description?: string) {
  return { id: 1, studyId, name, weight, description };
}

export async function createAiAnalysis(studyId: number, type: string, content: string, metadata?: any) {
  return { id: 1, studyId, type, content, metadata };
}

export async function getLatestAiAnalysisByType(studyId: number, type: string) {
  return null;
}

export async function createStatusRule(studyId: number, name: string, condition: string, action: string) {
  return { id: 1, studyId, name, condition, action };
}

export async function updateStatusRule(ruleId: number, data: any) {
  return { id: ruleId, ...data };
}

export async function getAlertThresholdsByStudyId(studyId: number) {
  return [];
}

export async function createAlertThreshold(studyId: number, name: string, threshold: number, type: string) {
  return { id: 1, studyId, name, threshold, type };
}

export async function markAlertAsRead(alertId: number) {
  return { id: alertId, read: true };
}

export async function getStatusRulesByStudyId(studyId: number) {
  return [];
}

export async function updateRisk(riskId: number, data: any) {
  return { id: riskId, ...data };
}

export async function deleteRisk(riskId: number) {
  return { success: true };
}

export async function createRisk(postId: number, name: string, description?: string, level?: string) {
  return { id: 1, postId, name, description, level };
}

/**
 * Aggregated queries for dashboard
 */
export async function getStudyDashboardData(studyId: number) {
  const studyData = await getStudyById(studyId);
  const optionsList = await getOptionsByStudyId(studyId);
  
  const optionsWithDetails = await Promise.all(
    optionsList.map(async (option) => {
      const postsList = await getPostsByOptionId(option.id);
      const postsWithDetails = await Promise.all(
        postsList.map(async (post) => {
          const actionsList = await getActionsByPostId(post.id);
          return { ...post, actions: actionsList };
        })
      );
      return { ...option, posts: postsWithDetails };
    })
  );

  const risksList = await getRisksByStudyId(studyId);
  const alertsList = await getAlertsByStudyId(studyId);
  const milestonesList = await getMilestonesByStudyId(studyId);

  return {
    study: studyData,
    options: optionsWithDetails,
    risks: risksList,
    alerts: alertsList,
    milestones: milestonesList,
  };
}
