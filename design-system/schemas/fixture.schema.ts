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

export const headerDataSchema = z.object({
  logo_label: z.string().min(1).max(80),
  nav: z.array(z.object({ href: z.string().startsWith('/'), label: z.string().min(1).max(40) }).strict()).min(1).max(7),
  phone: z.string().min(1).max(40),
  cta: z.object({ href: z.string().startsWith('/'), label: z.string().min(1).max(40) }).strict(),
}).strict();

export const breadcrumbsDataSchema = z.object({
  items: z.array(z.object({ name: z.string().min(1).max(100), url: z.string().startsWith('/') }).strict()).min(2).max(6),
}).strict();

const footerLinkSchema = z.object({ href: z.string().min(1), label: z.string().min(1).max(80) }).strict();
export const footerDataSchema = z.object({
  logo_label: z.string().min(1).max(80),
  description: z.string().min(1).max(300),
  sections: z.array(z.object({ title: z.string().min(1).max(40), links: z.array(footerLinkSchema).min(1).max(8) }).strict()).min(1).max(4),
  phone: z.string().min(1).max(40),
  email: z.email(),
  messengers: z.array(footerLinkSchema).max(4),
  legal_notice: z.string().min(1).max(200),
  legal_links: z.array(footerLinkSchema).min(1).max(5),
}).strict();

const ctaSchema = z.object({ href: z.string().startsWith('/'), label: z.string().min(1).max(60) }).strict();
const analyticsContactSchema = z.object({ event: z.literal('contact_click'), block_id: z.string().min(1) }).strict();

export const homeHeroDataSchema = z.object({
  eyebrow: z.string().min(1).max(80),
  title: z.string().min(1).max(140),
  lead: z.string().min(1).max(360),
  primary: ctaSchema,
  secondary: ctaSchema.optional(),
  stats: z.array(z.object({ value: z.string().min(1).max(24), label: z.string().min(1).max(80) }).strict()).min(1).max(4),
  analytics: analyticsContactSchema,
}).strict();

export const faqDataSchema = z.object({
  title: z.string().min(1).max(120),
  items: z.array(z.object({ question: z.string().min(1).max(180), answer: z.string().min(1).max(420) }).strict()).min(2).max(6),
}).strict();

export const ctaStripDataSchema = z.object({
  title: z.string().min(1).max(120),
  text: z.string().min(1).max(300),
  primary: ctaSchema,
  secondary: ctaSchema.optional(),
  analytics: analyticsContactSchema,
}).strict();

export const pricingDataSchema = z.object({
  title: z.string().min(1).max(120),
  disclaimer: z.literal('Не является публичной офертой'),
  items: z.array(z.object({ label: z.string().min(1).max(80), price: z.string().min(1).max(80), note: z.string().min(1).max(160) }).strict()).min(2).max(5),
}).strict();

export const leadFormDataSchema = z.object({
  title: z.string().min(1).max(120),
  text: z.string().min(1).max(260),
  fields: z.array(z.object({ name: z.string().min(1).max(40), label: z.string().min(1).max(80), required: z.boolean() }).strict()).min(2).max(5),
  submit: z.string().min(1).max(60),
  disabled_reason: z.string().min(1).max(180),
  analytics: analyticsContactSchema,
}).strict();

const fixtureBase = {
  schema_version: z.literal(1),
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  variant: z.string().min(1),
  viewport: z.enum(['sm', 'md', 'lg', 'xl']),
  mode: z.enum(['reference', 'long-content', 'minimal', 'missing-optional', 'mobile', 'interaction']),
};

export const fixtureSchema = z.discriminatedUnion('block_id', [
  z.object({ ...fixtureBase, block_id: z.literal('robot-card'), data: robotCardDataSchema }).strict(),
  z.object({ ...fixtureBase, block_id: z.literal('site-header'), data: headerDataSchema }).strict(),
  z.object({ ...fixtureBase, block_id: z.literal('breadcrumbs'), data: breadcrumbsDataSchema }).strict(),
  z.object({ ...fixtureBase, block_id: z.literal('site-footer'), data: footerDataSchema }).strict(),
  z.object({ ...fixtureBase, block_id: z.literal('home-hero'), data: homeHeroDataSchema }).strict(),
  z.object({ ...fixtureBase, block_id: z.literal('faq'), data: faqDataSchema }).strict(),
  z.object({ ...fixtureBase, block_id: z.literal('cta-strip'), data: ctaStripDataSchema }).strict(),
  z.object({ ...fixtureBase, block_id: z.literal('pricing'), data: pricingDataSchema }).strict(),
  z.object({ ...fixtureBase, block_id: z.literal('lead-form'), data: leadFormDataSchema }).strict(),
]);

export type DesignFixture = z.infer<typeof fixtureSchema>;
export type RobotCardData = z.infer<typeof robotCardDataSchema>;
export type HeaderData = z.infer<typeof headerDataSchema>;
export type BreadcrumbsData = z.infer<typeof breadcrumbsDataSchema>;
export type FooterData = z.infer<typeof footerDataSchema>;
export type HomeHeroData = z.infer<typeof homeHeroDataSchema>;
export type FaqData = z.infer<typeof faqDataSchema>;
export type CtaStripData = z.infer<typeof ctaStripDataSchema>;
export type PricingData = z.infer<typeof pricingDataSchema>;
export type LeadFormData = z.infer<typeof leadFormDataSchema>;
