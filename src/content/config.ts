import { z, defineCollection } from 'astro:content';

const postCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()).optional(),
    imgSrc: z.string().nullable().optional(),
  }),
});

export const collections = {
  'post': postCollection,
};