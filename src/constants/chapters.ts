import type { CollectionEntry } from "astro:content";
import type { SeriesId } from "@/constants/series";

export type ChapterGroup = {
  title: string;
  series?: SeriesId;
  postIds?: string[];
};

export type Chapter = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  card: string;
  groups: ChapterGroup[];
};

export const CHAPTERS = [
  {
    id: "fundamentals",
    kicker: "Notebook",
    title: "Fundamentals",
    description:
      "Deep dive sui fondamenti. Ogni gruppo è una serie in corso, o un pezzo solo.",
    card: "The structures a model is built on.",
    groups: [
      { title: "ML deep dives", series: "ml-deep-dives" },
      {
        title: "Voronoi teaching ML",
        series: "voronoi-diagrams-ml",
      },
      {
        title: "The drawing is not the graph",
        series: "il-disegno-non-e-il-grafo",
      },
      {
        title: "",
        postIds: ["beyond-the-shocks-2d-reconstruction"],
      },
    ],
  },
  {
    id: "case-studies",
    kicker: "Use cases",
    title: "Case studies",
    description:
      "Un sistema pubblicato, un vincolo. I fondamenti citati restano nel quaderno.",
    card: "Readings of detection in production. Today, the cascade: the rule first, then the model.",
    groups: [{ title: "Detection", series: "detection-at-scale" }],
  },
  {
    id: "finanza",
    kicker: "Markets",
    title: "Finance",
    description: "Il campione storico e il prezzo.",
    card: "Pricing with Black-Scholes.",
    groups: [{ title: "", postIds: ["black-scholes"] }],
  },
  {
    id: "software",
    kicker: "Software",
    title: "Software",
    description:
      "Design e informatica, nella stessa lista. Una serie nasce al secondo pezzo sullo stesso oggetto.",
    card: "System design and ML system design.",
    groups: [
      {
        title: "",
        postIds: ["system-design-story-map", "multi-stage-docker"],
      },
    ],
  },
] as const satisfies readonly Chapter[];

export type ChapterId = (typeof CHAPTERS)[number]["id"];

export function getChapter(id: string) {
  return CHAPTERS.find(chapter => chapter.id === id);
}

export function postsInGroup(
  posts: CollectionEntry<"blog">[],
  group: ChapterGroup,
) {
  if (group.series) {
    return posts
      .filter(post => post.data.series === group.series)
      .sort(
        (a, b) => (a.data.seriesPart ?? 0) - (b.data.seriesPart ?? 0),
      );
  }

  const ids = new Set(group.postIds ?? []);
  return posts.filter(post => ids.has(post.id));
}
