import { z } from 'zod';

const sourceSchema = z.object({
  path: z.string().regex(/^docs\/source\/reference-.+\.html$/),
  role: z.literal('approved_base_visual_reference'),
  viewport: z.number().int().positive(),
}).strict();

const locatorSchema = z.object({
  marker: z.string().min(1),
  selector: z.string().regex(/^[.#][a-z0-9_-]+$/i),
}).strict();

export const visualReferenceMapSchema = z.object({
  schema_version: z.literal(1),
  decision: z.object({
    issue: z.literal('KIBER-86'),
    status: z.literal('approved_base'),
    approved_by: z.literal('owner'),
    approved_at: z.iso.date(),
  }).strict(),
  sources: z.object({
    desktop: sourceSchema,
    mobile: sourceSchema,
  }).strict(),
  blocks: z.array(z.object({
    review_id: z.string().regex(/^(0[1-9]|[12][0-9]|3[0-4])$/),
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    desktop: locatorSchema,
    mobile: locatorSchema,
  }).strict()).length(34),
}).strict();

export type VisualReferenceMap = z.infer<typeof visualReferenceMapSchema>;
