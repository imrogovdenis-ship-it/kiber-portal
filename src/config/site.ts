import { z } from 'zod';

const publicConfigSchema = z.object({
  phone: z.string().min(1),
  telegram: z.url(),
  whatsapp: z.url(),
  siteUrl: z.url(),
}).strict();

export const siteConfig = publicConfigSchema.parse({
  phone: import.meta.env.PUBLIC_PHONE ?? '+7 000 000-00-00',
  telegram: import.meta.env.PUBLIC_TG ?? 'https://t.me/kiber_portal',
  whatsapp: import.meta.env.PUBLIC_WA ?? 'https://wa.me/70000000000',
  siteUrl: import.meta.env.PUBLIC_SITE_URL ?? 'https://www.kiber-portal.ru',
});
