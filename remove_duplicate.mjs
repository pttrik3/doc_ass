import { drizzle } from "drizzle-orm/mysql2";
import { templates } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

// Remove the second duplicate (ID: 30002)
await db.delete(templates).where(eq(templates.id, 30002));

console.log("Duplicate Therapist Soap Note template removed (ID: 30002)");
process.exit(0);
