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

// Type exports
export type ApiConfig = z.infer<typeof ApiConfigSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type FeatureListParams = z.infer<typeof FeatureListParamsSchema>;
