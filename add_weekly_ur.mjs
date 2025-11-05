import { drizzle } from "drizzle-orm/mysql2";
import { templates } from "./drizzle/schema.ts";
import fs from "fs";

const db = drizzle(process.env.DATABASE_URL);

const weeklyURContent = fs.readFileSync("./weekly_ur_template.txt", "utf-8");

await db.insert(templates).values({
  name: "Weekly UR",
  description: "Weekly utilization review covering criteria, symptoms, risk management, and support system",
  content: weeklyURContent,
  createdBy: 1, // Admin user ID
});

console.log("Weekly UR template added successfully");
