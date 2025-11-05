import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
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
 * Form templates table for storing reusable blank forms
 */
export const templates = mysqlTable("templates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  content: text("content").notNull(),
  /** True for user-uploaded templates, false for system templates */
  isCustom: mysqlEnum("isCustom", ["true", "false"]).default("false").notNull(),
  createdBy: int("createdBy").notNull().references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = typeof templates.$inferInsert;

/**
 * Forms table for storing completed forms and completion history
 */
export const forms = mysqlTable("forms", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  /** The blank form questions/template */
  formContent: text("formContent").notNull(),
  /** Client information provided for this form */
  clientInfo: text("clientInfo").notNull(),
  /** DeepSeek's completed form with answers */
  completedContent: text("completedContent"),
  /** Processing status */
  status: mysqlEnum("status", ["draft", "pending", "completed", "failed"]).default("pending").notNull(),
  /** Writing style example for tone matching */
  writingStyleExample: text("writingStyleExample"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Form = typeof forms.$inferSelect;
export type InsertForm = typeof forms.$inferInsert;

/**
 * Stores user API keys for DeepSeek
 */
export const apiKeys = mysqlTable("apiKeys", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  /** Encrypted DeepSeek API key */
  encryptedKey: text("encryptedKey").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;

/**
 * Stores common topics for each modality in Group Session DAP Notes
 */
export const commonTopics = mysqlTable("commonTopics", {
  id: int("id").autoincrement().primaryKey(),
  /** Modality type: cbt, dbt, personCentered, motivationEnhancement, mindfulness, act, twelveStep */
  modality: varchar("modality", { length: 50 }).notNull(),
  /** Topic text */
  topic: text("topic").notNull(),
  /** Display order */
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CommonTopic = typeof commonTopics.$inferSelect;
export type InsertCommonTopic = typeof commonTopics.$inferInsert;