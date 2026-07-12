import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
      // AGGIUNGI QUESTE DUE RIGHE QUI SOTTO:
      link_url: z.string().optional(),
      link_name: z.string().optional(),
      series: z.string().optional(),
      seriesPart: z.number().int().positive().optional(),
    })
    .refine(
      data =>
        (data.series == null && data.seriesPart == null) ||
        (data.series != null && data.seriesPart != null),
      {
        message: "series and seriesPart must both be set or both omitted",
      },
    ),
});

export const collections = { blog };