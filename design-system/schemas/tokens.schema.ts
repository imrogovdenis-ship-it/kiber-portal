import { z } from 'zod';

export const breakpoints = ['sm', 'md', 'lg', 'xl'] as const;
const scalar = z.union([z.string().min(1), z.number(), z.boolean()]);
const responsive = z.object({
  sm: scalar,
  md: scalar,
  lg: scalar,
  xl: scalar,
}).strict();

export const tokenSchema = z.object({
  type: z.enum(['color', 'dimension', 'number', 'fontFamily', 'fontWeight', 'string']),
  value: z.union([scalar, responsive]),
  css: z.string().regex(/^--kp-[a-z0-9-]+$/).optional(),
  emit: z.boolean().optional(),
}).strict();

export const tokenFileSchema = z.object({
  layer: z.enum(['primitive', 'semantic', 'component']),
  namespace: z.string().min(1),
  tokens: z.record(z.string().min(1), tokenSchema),
}).strict();

export type Token = z.infer<typeof tokenSchema>;
export type TokenFile = z.infer<typeof tokenFileSchema>;
