import { z } from 'zod';

const publicConfigSchema = z.object({
  phone: z.string().min(1),
  telegram: z.url(),
  whatsapp: z.url(),
  max: z.url(),
  email: z.email(),
  siteUrl: z.url(),
  region: z.string().min(1),
  legalName: z.string().min(1),
  inn: z.string().regex(/^\d{10,12}$/),
  ogrnip: z.string().regex(/^\d{15}$/),
  address: z.string().min(1),
}).strict();

export const siteConfig = publicConfigSchema.parse({
  phone: import.meta.env.PUBLIC_PHONE ?? '+7 (906) 730-96-91',
  telegram: import.meta.env.PUBLIC_TG ?? 'https://t.me/+79067309691',
  whatsapp: import.meta.env.PUBLIC_WA ?? 'https://wa.me/79067309691?text=%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82.%20%D0%9F%D0%B8%D1%88%D1%83%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20kiber-portal.ru',
  max: import.meta.env.PUBLIC_MAX ?? 'https://max.ru/u/f9LHodD0cOJhJ-X4IZgcN132WZOzWIuvqM8KhYmQShyPoEZQ-C84DJgI4M0',
  email: import.meta.env.PUBLIC_EMAIL ?? 'markinas28@yandex.ru',
  siteUrl: import.meta.env.PUBLIC_SITE_URL ?? 'https://www.kiber-portal.ru',
  region: import.meta.env.PUBLIC_REGION ?? 'Москва',
  legalName: import.meta.env.PUBLIC_LEGAL_NAME ?? 'ИП Маркин Александр Сергеевич',
  inn: import.meta.env.PUBLIC_INN ?? '771898397717',
  ogrnip: import.meta.env.PUBLIC_OGRNIP ?? '326774600084499',
  address: import.meta.env.PUBLIC_ADDRESS ?? 'Нижний Сусальный переулок, 9, стр. 4А',
});
