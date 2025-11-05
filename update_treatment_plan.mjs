import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { templates } from "./drizzle/schema.ts";
import { readFileSync } from "fs";

const db = drizzle(process.env.DATABASE_URL);

const content = readFileSync("/home/ubuntu/upload/BLANKTreatmentPlan.txt", "utf-8");

// Find and update Treatment Plan template
const existingTemplates = await db.select().from(templates).where(eq(templates.name, "Treatment Plan"));

if (existingTemplates.length > 0) {
  await db.update(templates)
    .set({ content: content, updatedAt: new Date() })
    .where(eq(templates.name, "Treatment Plan"));
  console.log("Treatment Plan template updated successfully!");
} else {
  console.log("Treatment Plan template not found!");
}

process.exit(0);
