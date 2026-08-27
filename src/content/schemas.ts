import { z } from 'zod';

const statusSchema = z.enum(['draft', 'review', 'published', 'archived']);
const seoSchema = z.object({
  title: z.string().min(10).max(70),
  description: z.string().min(20).max(180),
  canonical: z.url(),
}).strict();
const faqSchema = z.object({ question: z.string().min(1), answer: z.string().min(1) }).strict();
const reviewOnlySchema = z.object({
  publicRender: z.literal(false),
  owner: z.string().min(1),
  lastReviewedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  internalNotes: z.array(z.string().min(1)).max(20),
}).strict();

export const robotSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: statusSchema,
  identity: z.object({ name: z.string(), manufacturer: z.string(), model: z.string() }).strict(),
  seo: seoSchema,
  media: z.object({
    hero: z.object({ src: z.string().startsWith('/'), alt: z.string().min(1) }).strict(),
    gallery: z.array(z.object({ src: z.string().startsWith('/'), alt: z.string().min(1) }).strict()).max(20),
  }).strict(),
  service: z.object({
    format: z.literal('accompanied'),
    specialist_included: z.literal(true),
    standalone_rental: z.literal(false),
    manager_confirmation_required: z.literal(true),
    scenarios: z.array(z.string()).max(12),
    limitations: z.array(z.string()).max(12),
    venue_requirements: z.array(z.string()).max(12),
  }).strict(),
  pricing: z.object({
    mode: z.enum(['calculated', 'from', 'fixed']),
    currency: z.literal('RUB'),
    display: z.string().min(1),
    factors: z.array(z.enum(['duration', 'program', 'logistics'])).min(1),
    public_offer: z.literal(false),
    disclaimer: z.literal('Не является публичной офертой'),
  }).strict(),
  facts: z.array(z.string()).max(12),
  faq: z.array(faqSchema).max(20),
  review: reviewOnlySchema.optional(),
}).strict();

export const publicationSchema = z.looseObject({
  title: z.string().min(1),
  status: statusSchema,
  seo: seoSchema,
  review: reviewOnlySchema.optional(),
});
