import { drizzle } from "drizzle-orm/mysql2";
import { commonTopics } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const initialTopics = [
  // CBT Topics
  { modality: "cbt", topic: "Identifying and Challenging Negative Thoughts", sortOrder: 1 },
  { modality: "cbt", topic: "Cognitive Distortions and Reframing", sortOrder: 2 },
  { modality: "cbt", topic: "Behavioral Activation and Activity Scheduling", sortOrder: 3 },
  { modality: "cbt", topic: "Problem-Solving Skills", sortOrder: 4 },
  { modality: "cbt", topic: "Thought Records and Journaling", sortOrder: 5 },
  
  // DBT Topics
  { modality: "dbt", topic: "Mindfulness and Present Moment Awareness", sortOrder: 1 },
  { modality: "dbt", topic: "Distress Tolerance Skills", sortOrder: 2 },
  { modality: "dbt", topic: "Emotion Regulation Techniques", sortOrder: 3 },
  { modality: "dbt", topic: "Interpersonal Effectiveness", sortOrder: 4 },
  { modality: "dbt", topic: "Radical Acceptance", sortOrder: 5 },
  
  // Person Centered Topics
  { modality: "personCentered", topic: "Building Self-Awareness and Self-Acceptance", sortOrder: 1 },
  { modality: "personCentered", topic: "Exploring Personal Values and Goals", sortOrder: 2 },
  { modality: "personCentered", topic: "Developing Authentic Relationships", sortOrder: 3 },
  { modality: "personCentered", topic: "Processing Emotions and Experiences", sortOrder: 4 },
  { modality: "personCentered", topic: "Enhancing Self-Esteem and Self-Worth", sortOrder: 5 },
  
  // Motivation Enhancement Topics
  { modality: "motivationEnhancement", topic: "Exploring Ambivalence About Change", sortOrder: 1 },
  { modality: "motivationEnhancement", topic: "Building Intrinsic Motivation", sortOrder: 2 },
  { modality: "motivationEnhancement", topic: "Setting Personal Goals and Action Plans", sortOrder: 3 },
  { modality: "motivationEnhancement", topic: "Identifying Values and Discrepancies", sortOrder: 4 },
  { modality: "motivationEnhancement", topic: "Strengthening Commitment to Change", sortOrder: 5 },
  
  // Mindfulness Topics
  { modality: "mindfulness", topic: "Body Scan and Breath Awareness", sortOrder: 1 },
  { modality: "mindfulness", topic: "Mindful Movement and Yoga", sortOrder: 2 },
  { modality: "mindfulness", topic: "Observing Thoughts Without Judgment", sortOrder: 3 },
  { modality: "mindfulness", topic: "Grounding Techniques", sortOrder: 4 },
  { modality: "mindfulness", topic: "Loving-Kindness Meditation", sortOrder: 5 },
  
  // ACT Topics
  { modality: "act", topic: "Acceptance and Psychological Flexibility", sortOrder: 1 },
  { modality: "act", topic: "Values Clarification and Committed Action", sortOrder: 2 },
  { modality: "act", topic: "Cognitive Defusion Techniques", sortOrder: 3 },
  { modality: "act", topic: "Self as Context", sortOrder: 4 },
  { modality: "act", topic: "Present Moment Awareness", sortOrder: 5 },
  
  // 12 Step Topics
  { modality: "twelveStep", topic: "Understanding the 12 Steps", sortOrder: 1 },
  { modality: "twelveStep", topic: "Working Step 1: Powerlessness and Unmanageability", sortOrder: 2 },
  { modality: "twelveStep", topic: "Higher Power and Spirituality", sortOrder: 3 },
  { modality: "twelveStep", topic: "Making Amends and Step 9", sortOrder: 4 },
  { modality: "twelveStep", topic: "Daily Inventory and Step 10", sortOrder: 5 },
];

async function seed() {
  console.log("Seeding common topics...");
  
  for (const topic of initialTopics) {
    await db.insert(commonTopics).values(topic);
  }
  
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
