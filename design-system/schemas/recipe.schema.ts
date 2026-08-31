import { z } from 'zod';

export const recipeSchema = z.object({
  schema_version: z.literal(1),
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  layout: z.string().min(1),
  seo_profile: z.string().min(1),
  route: z.string().startsWith('/').optional(),
  production: z.boolean().optional(),
  blocks: z.array(z.object({
    id: z.string().min(1),
    variant: z.string().min(1),
    source: z.string().min(1).optional(),
    condition: z.string().min(1).optional(),
  }).strict()).min(1),
}).strict();
