import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, forms, Form, InsertForm, apiKeys, ApiKey, InsertApiKey, templates, Template, InsertTemplate, commonTopics, CommonTopic, InsertCommonTopic } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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

// Form queries
export async function createForm(form: InsertForm): Promise<Form> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(forms).values(form);
  const insertedId = Number(result[0].insertId);
  return (await db.select().from(forms).where(eq(forms.id, insertedId)).limit(1))[0];
}

export async function updateForm(id: number, updates: Partial<InsertForm>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(forms).set(updates).where(eq(forms.id, id));
}

export async function getFormById(id: number): Promise<Form | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(forms).where(eq(forms.id, id)).limit(1);
  return result[0];
}

export async function getUserForms(userId: number): Promise<Form[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(forms).where(eq(forms.userId, userId)).orderBy(desc(forms.createdAt));
}

// API Key queries
export async function saveApiKey(apiKey: InsertApiKey): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(apiKeys).values(apiKey).onDuplicateKeyUpdate({
    set: { encryptedKey: apiKey.encryptedKey, updatedAt: new Date() },
  });
}

export async function getApiKey(userId: number): Promise<ApiKey | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(apiKeys).where(eq(apiKeys.userId, userId)).limit(1);
  return result[0];
}

// Template queries
export async function createTemplate(template: InsertTemplate): Promise<Template> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(templates).values(template);
  const insertedId = Number(result[0].insertId);
  return (await db.select().from(templates).where(eq(templates.id, insertedId)).limit(1))[0];
}

export async function getAllTemplates(): Promise<Template[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(templates).orderBy(templates.name);
}

export async function getTemplateById(id: number): Promise<Template | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(templates).where(eq(templates.id, id)).limit(1);
  return result[0];
}

export async function updateTemplate(id: number, data: Partial<InsertTemplate>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(templates).set(data).where(eq(templates.id, id));
}

export async function deleteTemplate(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(templates).where(eq(templates.id, id));
}

// Common Topics queries
export async function getAllCommonTopics(): Promise<CommonTopic[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(commonTopics).orderBy(commonTopics.modality, commonTopics.sortOrder);
}

export async function getCommonTopicsByModality(modality: string): Promise<CommonTopic[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(commonTopics).where(eq(commonTopics.modality, modality)).orderBy(commonTopics.sortOrder);
}

export async function createCommonTopic(topic: InsertCommonTopic): Promise<CommonTopic> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(commonTopics).values(topic);
  const insertedId = Number(result[0].insertId);
  return (await db.select().from(commonTopics).where(eq(commonTopics.id, insertedId)).limit(1))[0];
}

export async function updateCommonTopic(id: number, data: Partial<InsertCommonTopic>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(commonTopics).set(data).where(eq(commonTopics.id, id));
}

export async function deleteCommonTopic(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(commonTopics).where(eq(commonTopics.id, id));
}
