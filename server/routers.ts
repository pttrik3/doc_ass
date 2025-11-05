import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Form completion features
  forms: router({
    // Get all forms for current user
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserForms } = await import("./db");
      return getUserForms(ctx.user.id);
    }),

    // Get a specific form by ID
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const { getFormById } = await import("./db");
        const form = await getFormById(input.id);
        if (!form || form.userId !== ctx.user.id) {
          throw new Error("Form not found");
        }
        return form;
      }),

    // Create and complete a new form
    complete: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          formContent: z.string().min(1),
          clientInfo: z.string().min(1),
          templateName: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createForm, updateForm, getApiKey } = await import("./db");
        const { decryptApiKey, completeFormWithDeepSeek } = await import("./deepseek");

        // Get user's API key
        const apiKeyRecord = await getApiKey(ctx.user.id);
        if (!apiKeyRecord) {
          throw new Error("Please configure your API key first");
        }

        const apiKey = decryptApiKey(apiKeyRecord.encryptedKey);

        // Create form record
        const form = await createForm({
          userId: ctx.user.id,
          title: input.title,
          formContent: input.formContent,
          clientInfo: input.clientInfo,
          status: "pending",
        });

        try {
          // Call DeepSeek to complete the form
          const completedContent = await completeFormWithDeepSeek(
            apiKey,
            input.formContent,
            input.clientInfo,
            input.templateName
          );

          // Update form with completed content
          await updateForm(form.id, {
            completedContent,
            status: "completed",
          });

          return { id: form.id, completedContent };
        } catch (error) {
          // Mark as failed
          await updateForm(form.id, {
            status: "failed",
          });
          throw error;
        }
      }),

    // Save draft for later
    saveDraft: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          formContent: z.string().min(1),
          clientInfo: z.string().min(1),
          writingStyleExample: z.string().optional(),
          completedContent: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {        const { createForm } = await import("./db");

        const form = await createForm({
          userId: ctx.user.id,
          title: input.title,
          formContent: input.formContent,
          clientInfo: input.clientInfo,
          writingStyleExample: input.writingStyleExample,
          completedContent: input.completedContent,
          status: "draft",
        });

        return { success: true, formId: form.id };
      }),
  }),

  // API Key management
  apiKey: router({
    // Check if user has API key configured
    hasKey: protectedProcedure.query(async ({ ctx }) => {
      const { getApiKey } = await import("./db");
      const apiKeyRecord = await getApiKey(ctx.user.id);
      return { hasKey: !!apiKeyRecord };
    }),

    // Save or update API key
    save: protectedProcedure
      .input(z.object({ apiKey: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const { saveApiKey } = await import("./db");
        const { encryptApiKey } = await import("./deepseek");

        const encryptedKey = encryptApiKey(input.apiKey);
        await saveApiKey({
          userId: ctx.user.id,
          encryptedKey,
        });

        return { success: true };
      }),
  }),

  // Template management (admin only for create/update/delete)
  templates: router({
    // Get all templates (available to all authenticated users)
    list: protectedProcedure.query(async () => {
      const { getAllTemplates } = await import("./db");
      return getAllTemplates();
    }),

    // Get a specific template by ID
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getTemplateById } = await import("./db");
        return getTemplateById(input.id);
      }),

    // Create a new template (admin only)
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          content: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can create templates");
        }
        const { createTemplate } = await import("./db");
        return createTemplate({
          ...input,
          createdBy: ctx.user.id,
        });
      }),

    // Update a template (admin only)
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(1).optional(),
          description: z.string().optional(),
          content: z.string().min(1).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can update templates");
        }
        const { id, ...data } = input;
        const { updateTemplate } = await import("./db");
        await updateTemplate(id, data);
        return { success: true };
      }),

    // Delete a template (admin only for system templates, users can delete their own custom templates)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { getTemplateById, deleteTemplate } = await import("./db");
        const template = await getTemplateById(input.id);
        
        if (!template) {
          throw new Error("Template not found");
        }
        
        // Allow users to delete their own custom templates, or admins to delete any template
        if (template.isCustom === "true" && template.createdBy === ctx.user.id) {
          await deleteTemplate(input.id);
          return { success: true };
        }
        
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can delete system templates");
        }
        
        await deleteTemplate(input.id);
        return { success: true };
      }),

    // Upload custom template (any authenticated user)
    uploadCustom: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          content: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createTemplate } = await import("./db");
        return createTemplate({
          ...input,
          isCustom: "true" as const,
          createdBy: ctx.user.id,
        });
      }),
  }),

  // Common Topics management
  commonTopics: router({    // Get all common topics
    list: protectedProcedure.query(async () => {
      const { getAllCommonTopics } = await import("./db");
      return getAllCommonTopics();
    }),

    // Get topics by modality
    getByModality: protectedProcedure
      .input(z.object({ modality: z.string() }))
      .query(async ({ input }) => {
        const { getCommonTopicsByModality } = await import("./db");
        return getCommonTopicsByModality(input.modality);
      }),

    // Create a new common topic (admin only)
    create: protectedProcedure
      .input(
        z.object({
          modality: z.string().min(1),
          topic: z.string().min(1),
          sortOrder: z.number().default(0),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can create common topics");
        }
        const { createCommonTopic } = await import("./db");
        return createCommonTopic(input);
      }),

    // Update a common topic (admin only)
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          modality: z.string().min(1).optional(),
          topic: z.string().min(1).optional(),
          sortOrder: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can update common topics");
        }
        const { id, ...data } = input;
        const { updateCommonTopic } = await import("./db");
        await updateCommonTopic(id, data);
        return { success: true };
      }),

    // Delete a common topic (admin only)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only admins can delete common topics");
        }
        const { deleteCommonTopic } = await import("./db");
        await deleteCommonTopic(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
