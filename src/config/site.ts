import { z } from 'zod';

const publicConfigSchema = z.object({
  phone: z.string().min(1),
  telegram: z.url(),
  whatsapp: z.url(),
  email: z.email(),
  siteUrl: z.url(),
  region: z.string().min(1),
  legalName: z.string().min(1),
  inn: z.string().regex(/^\d{10,12}$/),
  ogrnip: z.string().regex(/^\d{15}$/),
  address: z.string().min(1),
}).strict();

export const siteConfig = publicConfigSchema.parse({
  phone: import.meta.env.PUBLIC_PHONE ?? '+7 985 266-65-82',
  telegram: import.meta.env.PUBLIC_TG ?? 'https://t.me/+79852666582',
  whatsapp: import.meta.env.PUBLIC_WA ?? 'https://wa.me/79852666582',
  email: import.meta.env.PUBLIC_EMAIL ?? 'markinas28@yandex.ru',
  siteUrl: import.meta.env.PUBLIC_SITE_URL ?? 'https://www.kiber-portal.ru',
  region: import.meta.env.PUBLIC_REGION ?? 'Москва',
  legalName: import.meta.env.PUBLIC_LEGAL_NAME ?? 'ИП Маркин Александр Сергеевич',
  inn: import.meta.env.PUBLIC_INN ?? '771898397717',
  ogrnip: import.meta.env.PUBLIC_OGRNIP ?? '326774600084499',
  address: import.meta.env.PUBLIC_ADDRESS ?? 'Нижний Сусальный переулок, 9, стр. 4А',
});
