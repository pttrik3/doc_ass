import crypto from "crypto";

const ENCRYPTION_KEY = process.env.JWT_SECRET || "default-encryption-key-change-this";
const ALGORITHM = "aes-256-cbc";

/**
 * Encrypt API key for storage
 */
export function encryptApiKey(apiKey: string): string {
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(apiKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  return iv.toString("hex") + ":" + encrypted;
}

/**
 * Decrypt API key from storage
 */
export function decryptApiKey(encryptedKey: string): string {
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
  const parts = encryptedKey.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = parts[1];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}

/**
 * Call AI API to complete a document
 */
export async function completeFormWithDeepSeek(
  apiKey: string,
  formContent: string,
  clientInfo: string,
  templateName?: string,
  onChunk?: (chunk: string) => void
): Promise<string> {
  const isTreatmentPlan = templateName === "Treatment Plan";
  const isGroupDAPNote = templateName === "Group Session DAP Note";
  
  const systemPrompt = isGroupDAPNote
    ? `You are a professional group therapy documentation assistant. Your task is to create comprehensive Group Therapy DAP (Data, Assessment, Plan) notes based on the group topic and client information provided.

CRITICAL INSTRUCTIONS:
1. Start with the Group Topic as a heading
2. Write a comprehensive Group Description paragraph (6-8 sentences) that:
   - Describes the group session focused on the stated topic
   - Includes key themes discussed and therapeutic approaches used
   - Incorporates the specified modalities (CBT, DBT, etc.) if provided
   - Describes overall group dynamics and engagement
3. Organize client notes into THREE categories:
   - Positive Clients (Notes 1-5): Highly engaged, making strong progress
   - Engaged Clients (Notes 6-25): Participating well, showing insight
   - Apathetic Clients (Notes 26-30): Low engagement, minimal participation
4. Each note follows D/A/P format:
   - D: (Data) Client's participation, statements, and behaviors
   - A: (Assessment) Clinical assessment of emotional state, progress, concerns
   - P: (Plan) Therapeutic interventions and continued support strategies
5. Make notes realistic and varied - different clients show different levels of engagement
6. Use professional clinical language
7. Reference the group topic throughout the notes
8. Incorporate modality-specific language when modalities are specified
9. Do NOT include a Clinical Summary section

Example Note Format:
Note 1
D: Client engaged fully, sharing examples of how [topic] has improved their peace of mind. They expressed pride in being able to say "no" to enabling behaviors from family members. They encouraged others to value their emotional space.
A: Client appeared grounded and confident, showing insight into how healthier communication fosters self-respect. They acknowledged that maintaining those boundaries remains a daily practice. Still, they expressed mild concern about emotional fatigue if family members continue to test their limits.
P: Continue to reinforce assertive communication techniques. Encourage self-care practices when family conflict arises. Monitor for emotional exhaustion or boundary guilt in future sessions.`
    : `You are a professional document completion assistant. Your task is to complete documents accurately based on the client information provided.

CRITICAL INSTRUCTIONS:
1. **Make ALL form questions bold** using markdown **bold** syntax
2. Each answer should start with "Client reports,"
3. Use direct quotes from the client when it makes sense
4. Add details to increase the content of the answers
5. For Yes/No questions, mark the appropriate checkbox
6. If information is not available, use N/A
7. Maintain the exact format of the original document
8. Be professional and thorough in your responses
${isTreatmentPlan ? '9. Do NOT include a Clinical Summary section for Treatment Plans' : '9. ALWAYS end the document with a comprehensive "Clinical Summary:" section'}

Example format:
**Question: What is the precipitating event?**
Answer: Client reports that he has reached a point where he can no longer manage his addiction on his own, stating, "I am trying to stop doing meth, I can't do it on my own."

**Question: Do you have children?**
Answer: Yes (checked) If yes, describe: Client reports having two children, ages 8 and 10.

${isTreatmentPlan ? '' : 'Clinical Summary Format (MUST be included at the end):\nClinical Summary: [Write 3-4 comprehensive paragraphs synthesizing all client information, including: severity of presenting issues, medical/psychiatric considerations, social/environmental factors, recovery capital assessment, risk factors, protective factors, and clinical recommendations. Use professional clinical language while maintaining empathy and insight into the client\'s situation.]'}`;

  const userPrompt = isGroupDAPNote
    ? `Create comprehensive Group Therapy DAP notes based on the information below.

CLIENT INFORMATION:
${clientInfo}

Generate 30 individual client notes organized as:
- Positive Clients (Notes 1-5)
- Engaged Clients (Notes 6-25) 
- Apathetic Clients (Notes 26-30)

Each note MUST follow this exact format:

Note #
D: [Write a full paragraph describing what the client said, did, or shared during the group session. Include specific examples, quotes, or behaviors observed. This should be 2-4 sentences of detailed observations.]
A: [Write a full paragraph providing clinical assessment and interpretation of the client's presentation, engagement level, insights, and progress. Include observations about their emotional state, understanding, and therapeutic progress. This should be 2-4 sentences of professional clinical analysis.]
P: [Write a full paragraph outlining the plan for continued treatment, recommendations, and areas to monitor or reinforce in future sessions. This should be 2-3 sentences of actionable clinical recommendations.]

Make each note unique, realistic, and professionally written. Vary the content based on the client's engagement level (Positive, Engaged, or Apathetic).`
    : `Use the information below to complete the form above. Add details to increase the content of the answers and each answer should start with "Client reports," and also use quotes from the client in some of the answers when it makes sense.

${isTreatmentPlan ? '' : 'IMPORTANT: After completing all form questions, you MUST add a comprehensive "Clinical Summary:" section at the very end that synthesizes all the information into 3-4 professional paragraphs.'}

BLANK DOCUMENT:
${formContent}

CLIENT INFORMATION:
${clientInfo}`;

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 8000,
        stream: !!onChunk, // Enable streaming if callback provided
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `DeepSeek API error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    // Handle streaming response
    if (onChunk && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(line => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || "";
              if (content) {
                fullContent += content;
                onChunk(content);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      return fullContent;
    }

    // Handle non-streaming response
    const data = await response.json();
    return data.choices[0]?.message?.content || "No response generated";
  } catch (error) {
    console.error("DeepSeek API error:", error);
    throw new Error(
      `Failed to complete form: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
