import { defineCollection, z } from 'astro:content';

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    icon: z.string().default('lucide:scissors'),
    price: z.string(),
    duration: z.string(),
    description: z.string(),
    slug: z.string(),
    image: z.string().optional(),
  }),
});

const gallery = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    beforeImage: z.string().optional(),
    afterImage: z.string().optional(),
    image: z.string().optional(),
    clientType: z.string().optional(),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { services, gallery, pages };
