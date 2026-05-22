import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  studies,
  options,
  posts,
  actions,
  risks,
  statusRules,
  alertThresholds,
  alerts,
  evaluationCriteria,
  optionScores,
  milestones,
  actionDependencies,
  aiAnalyses
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ ÉTUDES ============

export async function getStudiesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(studies).where(eq(studies.userId, userId));
}

export async function createStudy(userId: number, name: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(studies).values({
    userId,
    title: name,
    description,
  } as any);
}

export async function getStudyById(studyId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(studies).where(eq(studies.id, studyId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateStudy(studyId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(studies).set(data).where(eq(studies.id, studyId));
}

// ============ OPTIONS ============

export async function getOptionsByStudyId(studyId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(options).where(eq(options.studyId, studyId)).orderBy(options.order);
}

export async function createOption(studyId: number, name: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(options).values({
    studyId,
    name,
    description,
  });
}

export async function getOptionById(optionId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(options).where(eq(options.id, optionId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateOption(optionId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(options).set(data).where(eq(options.id, optionId));
}

export async function deleteOption(optionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(options).where(eq(options.id, optionId));
}

// ============ POSTES ============

export async function getPostsByOptionId(optionId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).where(eq(posts.optionId, optionId)).orderBy(posts.order);
}

export async function createPost(optionId: number, name: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(posts).values({
    optionId,
    name,
    description,
  });
}

export async function getPostById(postId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updatePost(postId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(posts).set(data).where(eq(posts.id, postId));
}

export async function deletePost(postId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(posts).where(eq(posts.id, postId));
}

// ============ ACTIONS ============

export async function getActionsByPostId(postId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(actions).where(eq(actions.postId, postId)).orderBy(actions.order);
}

export async function createAction(postId: number, name: string, data?: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(actions).values({
    postId,
    name,
    description: data?.description,
    status: data?.status || "idea",
    advancement: data?.advancement || 0,
    cost: data?.cost || 0,
    estimatedDays: data?.estimatedDays || 0,
  });
}

export async function getActionById(actionId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(actions).where(eq(actions.id, actionId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateAction(actionId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(actions).set(data).where(eq(actions.id, actionId));
}

export async function deleteAction(actionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(actions).where(eq(actions.id, actionId));
}

// ============ RISQUES ============

export async function getRisksByStudyId(studyId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(risks).where(eq(risks.studyId, studyId));
}

export async function getRisksByPostId(postId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(risks).where(eq(risks.postId, postId));
}

export async function createRisk(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(risks).values(data);
}

export async function updateRisk(riskId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(risks).set(data).where(eq(risks.id, riskId));
}

export async function deleteRisk(riskId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(risks).where(eq(risks.id, riskId));
}

// ============ ALERTES ============

export async function getAlertsByStudyId(studyId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(alerts).where(eq(alerts.studyId, studyId)).orderBy(desc(alerts.createdAt));
}

export async function createAlert(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(alerts).values(data);
}

export async function markAlertAsRead(alertId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(alerts).set({ isRead: true }).where(eq(alerts.id, alertId));
}

export async function deleteAlert(alertId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(alerts).where(eq(alerts.id, alertId));
}

// ============ SEUILS D'ALERTES ============

export async function getAlertThresholdsByStudyId(studyId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(alertThresholds).where(eq(alertThresholds.studyId, studyId));
}

export async function createAlertThreshold(
  studyId: number,
  name: string,
  type: "cost" | "delay" | "score" | "advancement",
  operator: "<" | ">" | "<=" | ">=" | "=" | "!=",
  threshold: number,
  severity: "info" | "warning" | "critical"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(alertThresholds).values({
    studyId,
    name,
    type,
    operator,
    threshold: threshold.toString() as any,
    severity,
    isActive: true,
  });
}

export async function updateAlertThresholdFn(thresholdId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(alertThresholds).set(data).where(eq(alertThresholds.id, thresholdId));
}

export async function deleteAlertThresholdFn(thresholdId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(alertThresholds).where(eq(alertThresholds.id, thresholdId));
}

// ============ RÈGLES DE STATUT ============

export async function getStatusRulesByStudyId(studyId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(statusRules).where(eq(statusRules.studyId, studyId)).orderBy(statusRules.order);
}

export async function createStatusRule(
  studyId: number,
  name: string,
  conditions: any,
  resultStatus: string,
  description?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(statusRules).values({
    studyId,
    name,
    description,
    conditions,
    resultStatus: resultStatus as any,
    isActive: true,
    order: 0,
  });
}

export async function updateStatusRule(ruleId: number, data: Partial<typeof statusRules.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(statusRules).set(data).where(eq(statusRules.id, ruleId));
}

export async function deleteStatusRule(ruleId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(statusRules).where(eq(statusRules.id, ruleId));
}

// ============ CRITÈRES D'ÉVALUATION ============

export async function getEvaluationCriteriaByStudyId(studyId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(evaluationCriteria).where(eq(evaluationCriteria.studyId, studyId)).orderBy(evaluationCriteria.order);
}

export async function createEvaluationCriteria(studyId: number, name: string, weight: number = 1, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(evaluationCriteria).values({
    studyId,
    name,
    description,
    weight: weight.toString() as any,
    order: 0,
  });
}

// ============ ANALYSES IA ============

export async function createAiAnalysis(
  studyId: number,
  type: "executive_summary" | "best_option_suggestion" | "risk_detection" | "full_analysis",
  content: string,
  metadata?: any
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(aiAnalyses).values({
    studyId,
    type,
    content,
    metadata,
  });
}

export async function getLatestAiAnalysisByType(studyId: number, type: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(aiAnalyses)
    .where(and(eq(aiAnalyses.studyId, studyId), eq(aiAnalyses.type, type as any)))
    .orderBy(desc(aiAnalyses.createdAt))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}
