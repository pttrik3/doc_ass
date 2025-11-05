import { Router } from "express";
import { sdk } from "./_core/sdk";
import { getApiKey, createForm, updateForm } from "./db";
import { decryptApiKey, completeFormWithDeepSeek } from "./deepseek";

export const streamingRouter = Router();

/**
 * SSE endpoint for streaming form completion
 */
streamingRouter.post("/api/forms/complete-stream", async (req, res) => {
  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    // Verify authentication
    const user = await sdk.authenticateRequest(req);
    if (!user) {
      res.write(`data: ${JSON.stringify({ error: "Not authenticated" })}\n\n`);
      res.end();
      return;
    }

    const { title, formContent, clientInfo, templateName } = req.body;

    // Get user's API key
    const apiKeyRecord = await getApiKey(user.id);
    if (!apiKeyRecord) {
      res.write(`data: ${JSON.stringify({ error: "Please configure your API key first" })}\n\n`);
      res.end();
      return;
    }

    const apiKey = decryptApiKey(apiKeyRecord.encryptedKey);

    // Create form record
    const form = await createForm({
      userId: user.id,
      title,
      formContent,
      clientInfo,
      status: "pending",
    });

    // Send form ID to client
    res.write(`data: ${JSON.stringify({ type: "form_id", formId: form.id })}\n\n`);

    // Stream completion
    const completedContent = await completeFormWithDeepSeek(
      apiKey,
      formContent,
      clientInfo,
      templateName,
      (chunk) => {
        // Send each chunk to client
        res.write(`data: ${JSON.stringify({ type: "chunk", content: chunk })}\n\n`);
      }
    );

    // Update form with completed content
    await updateForm(form.id, {
      completedContent,
      status: "completed",
    });

    // Send completion signal
    res.write(`data: ${JSON.stringify({ type: "done", formId: form.id })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Streaming error:", error);
    res.write(`data: ${JSON.stringify({ 
      type: "error", 
      error: error instanceof Error ? error.message : "Unknown error" 
    })}\n\n`);
    res.end();
  }
});
