import { detectionAtScaleSeries } from "./detection-at-scale";
import { disegnoGrafoSeries } from "./il-disegno-non-e-il-grafo";
import { mlDeepDivesSeries } from "./ml-deep-dives";
import { voronoiDiagramsMlSeries } from "./voronoi-diagrams-ml";

export const SERIES_REGISTRY = {
  [detectionAtScaleSeries.id]: detectionAtScaleSeries,
  [disegnoGrafoSeries.id]: disegnoGrafoSeries,
  [mlDeepDivesSeries.id]: mlDeepDivesSeries,
  [voronoiDiagramsMlSeries.id]: voronoiDiagramsMlSeries,
} as const;

export type SeriesId = keyof typeof SERIES_REGISTRY;

export function getSeriesRegistry(seriesId: string) {
  return SERIES_REGISTRY[seriesId as SeriesId];
}
