import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    source: z.string().url().optional(),
    sourceName: z.string().optional(),
    image: z.string().optional(),
    // Gancho escrito para o post do LinkedIn. O link e as hashtags saem das
    // tags e da URL do post, então aqui vai só o texto.
    linkedin: z.string().optional(),
    tags: z.array(z.string()).default([]),
    lang: z.enum(['pt', 'en']),
  }),
});

export const collections = { posts };
