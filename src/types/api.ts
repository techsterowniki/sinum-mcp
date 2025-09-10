import { z } from 'zod';

// API configuration schema
export const ApiConfigSchema = z.object({
  baseUrl: z.string().url(),
  apiKey: z.string(),
  timeout: z.number().default(10000),
});

// Error response schema
export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  code: z.number().optional(),
  details: z.record(z.any()).optional(),
});

// Feature list parameters schema
export const FeatureListParamsSchema = z.object({
  modified_since: z.number().optional(),
});

// Scene model schema
export const SceneModelSchema = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string(),
  enabled: z.boolean(),
  type: z.string(),
  banned: z.boolean(),
  ban_reason: z.string(),
  error_counter: z.number(),
  max_errors: z.number(),
  max_execution_time: z.number(),
  lua: z.string(),
  schema: z.string(),
  labels: z.array(z.string()),
  room_id: z.number(),
  dir_id: z.number(),
  tags: z.array(z.string()),
  delayed_actions: z.array(z.any()),
});

// Scene collection schema
export const SceneCollectionSchema = z.array(SceneModelSchema);

// Scene activate parameters schema
export const SceneActivateParamsSchema = z.object({
  id: z.number(),
});

// Type exports
export type ApiConfig = z.infer<typeof ApiConfigSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type FeatureListParams = z.infer<typeof FeatureListParamsSchema>;
export type SceneModel = z.infer<typeof SceneModelSchema>;
export type SceneCollection = z.infer<typeof SceneCollectionSchema>;
export type SceneActivateParams = z.infer<typeof SceneActivateParamsSchema>;
