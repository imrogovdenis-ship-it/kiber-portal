import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { publicationSchema, robotSchema } from './content/schemas';

const robots = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml,json}', base: './src/content/robots' }),
  schema: robotSchema,
});

const publication = (base: string) => defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx,yaml,yml,json}', base }),
  schema: publicationSchema,
});

export const collections = {
  robots,
  articles: publication('./src/content/articles'),
  compilations: publication('./src/content/compilations'),
  news: publication('./src/content/news'),
};
