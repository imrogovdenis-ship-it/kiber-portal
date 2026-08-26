import { z } from 'zod';

const parameterType = z.string().regex(/^(string|integer|boolean|enum\[[a-z_,]+\])$/);

export const analyticsSchema = z.object({
  schema_version: z.literal(1),
  events: z.array(z.object({
    name: z.string().regex(/^[a-z][a-z0-9_]+$/),
    description: z.string().min(1),
    trigger: z.string().min(1),
    source: z.object({
      pages: z.array(z.string()).min(1),
      blocks: z.array(z.string()).min(1),
    }).strict(),
    required: z.record(z.string(), parameterType),
    optional: z.record(z.string(), parameterType),
    consent: z.enum(['analytics', 'necessary']),
    metric_owner: z.string().min(1),
    example: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  }).strict()).min(1),
}).strict();
