import { drizzle } from "drizzle-orm/mysql2";
import { templates } from "./drizzle/schema.ts";
import { like } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

const soapTemplates = await db.select().from(templates).where(like(templates.name, "%Soap%"));

console.log("Found SOAP templates:");
soapTemplates.forEach(t => console.log(`ID: ${t.id}, Name: ${t.name}`));

process.exit(0);
