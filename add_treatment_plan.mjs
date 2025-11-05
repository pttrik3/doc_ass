import { drizzle } from "drizzle-orm/mysql2";
import { templates } from "./drizzle/schema.ts";
import fs from "fs";

const db = drizzle(process.env.DATABASE_URL);

const treatmentPlanContent = fs.readFileSync("/home/ubuntu/upload/BLANKTreatmentPlan.txt", "utf-8");

await db.insert(templates).values({
  name: "Treatment Plan",
  description: "3-week treatment plan with goals, objectives, and strategies (requires Problem input)",
  content: treatmentPlanContent,
  createdBy: 1,
});

console.log("Treatment Plan template added successfully!");
process.exit(0);
