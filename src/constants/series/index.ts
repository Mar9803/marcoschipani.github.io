import { mlDeepDivesSeries } from "./ml-deep-dives";
import { voronoiDiagramsMlSeries } from "./voronoi-diagrams-ml";

export const SERIES_REGISTRY = {
  [mlDeepDivesSeries.id]: mlDeepDivesSeries,
  [voronoiDiagramsMlSeries.id]: voronoiDiagramsMlSeries,
} as const;

export type SeriesId = keyof typeof SERIES_REGISTRY;

export function getSeriesRegistry(seriesId: string) {
  return SERIES_REGISTRY[seriesId as SeriesId];
}
