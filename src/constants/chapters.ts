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
    kicker: "Quaderno",
    title: "Fundamentals",
    description:
      "Deep dive sui fondamenti. Ogni gruppo è una serie in corso, o un pezzo solo.",
    card: "PCA e L1/L2, Voronoi, il disegno dei grafi, la ricostruzione.",
    groups: [
      { title: "ML deep dives", series: "ml-deep-dives" },
      {
        title: "Voronoi, per insegnare il machine learning",
        series: "voronoi-diagrams-ml",
      },
      { title: "Il disegno non è il grafo", series: "il-disegno-non-e-il-grafo" },
      {
        title: "Pezzi soli",
        postIds: ["beyond-the-shocks-2d-reconstruction"],
      },
    ],
  },
  {
    id: "case-studies",
    kicker: "Casi",
    title: "Case studies",
    description:
      "Un sistema pubblicato, un vincolo. I fondamenti citati restano nel quaderno.",
    card: "Letture di sistemi in produzione. Oggi, detection.",
    groups: [{ title: "Detection", series: "detection-at-scale" }],
  },
  {
    id: "finanza",
    kicker: "Dominio",
    title: "Finanza",
    description: "Il campione storico e il prezzo.",
    card: "Black-Scholes. Il resto del modulo entra qui quando è scritto.",
    groups: [{ title: "", postIds: ["black-scholes"] }],
  },
  {
    id: "software",
    kicker: "Software",
    title: "Software",
    description:
      "Design e informatica, nella stessa lista. Una serie nasce al secondo pezzo sullo stesso oggetto.",
    card: "La mappa di design e Docker.",
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
