import { drizzle } from "drizzle-orm/mysql2";
import { templates } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const soapContent = `Subjective (This section captures what the client reports. This is the "story" of their week and their current state.) -



Objective (therapist's observations of the client. It must be factual and measurable, free of interpretation.) -



Assessment (therapist's professional analysis and interpretation of the information from the S and O sections. It's where you synthesize the data to form a clinical opinion.) -



Plan (This section outlines the course of action moving forward. It is the "what's next" for the client's treatment.) -
`;

await db.insert(templates).values({
  name: "Therapist Soap Note",
  description: "SOAP format therapy session note (Subjective, Objective, Assessment, Plan)",
  content: soapContent,
  createdBy: 1,
});

console.log("Therapist Soap Note template added successfully!");
process.exit(0);
