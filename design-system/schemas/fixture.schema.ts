import { z } from 'zod';

export const robotCardDataSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  href: z.string().startsWith('/robots/'),
  title: z.string().min(1).max(120),
  category: z.string().min(1).max(80),
  price: z.string().min(1).max(80),
  price_disclaimer: z.literal('Не является публичной офертой'),
  description: z.string().min(1).max(420),
  image: z.object({ src: z.string().min(1), alt: z.string().min(1) }).strict().nullable().optional(),
  badge: z.string().min(1).max(24).optional(),
  analytics: z.object({
    event: z.literal('robot_card_click'),
    placement: z.enum(['catalog', 'related', 'collection', 'design_review']),
    position: z.number().int().positive().optional(),
  }).strict(),
}).strict();

export const fixtureSchema = z.object({
  schema_version: z.literal(1),
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  block_id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  variant: z.string().min(1),
  viewport: z.enum(['sm', 'md', 'lg', 'xl']),
  mode: z.enum(['reference', 'long-content', 'minimal', 'missing-optional', 'mobile', 'interaction']),
  data: robotCardDataSchema,
}).strict();

export type DesignFixture = z.infer<typeof fixtureSchema>;
export type RobotCardData = z.infer<typeof robotCardDataSchema>;
