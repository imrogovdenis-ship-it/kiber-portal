import { z } from 'zod';

export const templateSourceStatusSchema = z.enum([
  'owner_approved',
  'manufacturer',
  'page_content',
  'needs_review',
  'generated_needs_review',
]);

export const templatePriceStatusSchema = z.enum([
  'active',
  'request',
  'not_applicable',
  'missing',
  'needs_review',
]);

export const pageTemplateBlockSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).optional(),
  text: z.string().min(1).optional(),
  items: z.array(z.string().min(1)).default([]),
  sourceStatus: templateSourceStatusSchema.default('generated_needs_review'),
}).strict();

export const reviewOnlyTemplateSchema = z.object({
  publicRender: z.literal(false),
  blocks: z.array(z.string().min(1)).default([]),
  notes: z.array(z.string().min(1)).default([]),
}).strict();

export const templateSeoSchema = z.object({
  title: z.string().min(10),
  description: z.string().min(40),
  canonical: z.string().startsWith('/'),
  h1: z.string().min(3),
  primaryKeyword: z.string().min(3),
  secondaryKeywords: z.array(z.string()).default([]),
}).strict();

export const templateCtaSchema = z.object({
  label: z.string().min(1),
  href: z.string().startsWith('/'),
  note: z.string().optional(),
}).strict();

export const templateFaqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  sourceStatus: templateSourceStatusSchema.default('generated_needs_review'),
}).strict();

export const pageTemplateSchema = z.object({
  pageType: z.enum(['robot_card', 'article_detail', 'compilation']),
  status: z.enum(['draft_for_owner_review', 'approved_for_template_build', 'published']).default('draft_for_owner_review'),
  seo: templateSeoSchema,
  aiSummary: z.string().min(80),
  hero: pageTemplateBlockSchema,
  bodyBlocks: z.array(pageTemplateBlockSchema).default([]),
  cta: templateCtaSchema,
  faq: z.array(templateFaqSchema).default([]),
  reviewOnly: reviewOnlyTemplateSchema,
}).strict();

export const robotCardTemplateSchema = pageTemplateSchema.extend({
  pageType: z.literal('robot_card'),
  robot: z.object({
    name: z.string().min(1),
    manufacturer: z.string().min(1).optional(),
    model: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    priceStatus: templatePriceStatusSchema,
    priceDisplay: z.string().min(1),
    capabilities: z.array(pageTemplateBlockSchema).default([]),
    scenarios: z.array(pageTemplateBlockSchema).default([]),
    gallery: z.array(z.object({ src: z.string().startsWith('/'), alt: z.string().min(1), sourceStatus: templateSourceStatusSchema }).strict()).default([]),
  }).strict(),
}).strict();

export const articleDetailTemplateSchema = pageTemplateSchema.extend({
  pageType: z.literal('article_detail'),
  archetype: z.enum(['scenario/occasion', 'price_explainer', 'ideas/listicle', 'comparison']),
  optionalTypedBlocks: z.array(z.enum([
    'comparisonTable',
    'checkpointList',
    'numbersBlock',
    'catalogBlock',
    'relatedArticles',
    'gallery',
    'productCard',
    'twoColumnText',
    'scenarioList',
  ])).default([]),
}).strict();

export const compilationTemplateSchema = pageTemplateSchema.extend({
  pageType: z.literal('compilation'),
  publicLabel: z.literal('Подборки'),
  aliases: z.array(z.literal('сборка')).default(['сборка']),
  catalogItems: z.array(pageTemplateBlockSchema).default([]),
  relatedArticles: z.array(templateCtaSchema).default([]),
  otherCompilations: z.array(templateCtaSchema).default([]),
}).strict();

export type PageTemplate = z.infer<typeof pageTemplateSchema>;
export type RobotCardTemplateData = z.infer<typeof robotCardTemplateSchema>;
export type ArticleDetailTemplateData = z.infer<typeof articleDetailTemplateSchema>;
export type CompilationTemplateData = z.infer<typeof compilationTemplateSchema>;
