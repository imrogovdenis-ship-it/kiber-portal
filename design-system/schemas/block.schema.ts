import { z } from 'zod';

const tokenReference = z.string().regex(/^\{[a-z0-9.-]+\}$/);

export const blockSchema = z.object({
  schema_version: z.literal(1),
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  review_id: z.string().regex(/^(0[1-9]|[12][0-9]|3[0-4])$/),
  name: z.string().min(1),
  status: z.enum(['draft', 'pilot', 'stable', 'deprecated']),
  component: z.string().regex(/^src\/components\/.+\.astro$/),
  used_in: z.array(z.string().min(1)).min(1),
  variants: z.array(z.string().min(1)).min(1),
  tokens: z.record(z.string().min(1), tokenReference),
  content_contract: z.object({
    required: z.array(z.string()).min(1),
    optional: z.array(z.string()),
    rules: z.array(z.string()).min(1),
  }).strict(),
  responsive: z.object({
    sm: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
    md: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
    lg: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
    xl: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  }).strict(),
  accessibility: z.object({
    landmark: z.string().min(1),
    image_alt_required: z.boolean(),
    full_card_link: z.boolean(),
    focus_visible: z.boolean(),
  }).strict(),
  analytics: z.object({ events: z.array(z.string()).min(1) }).strict(),
  fixtures: z.array(z.string().min(1)).min(1),
  traceability: z.array(z.object({ source: z.string(), locator: z.string() }).strict()).min(1),
}).strict();

export type BlockSpec = z.infer<typeof blockSchema>;
