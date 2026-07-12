import { mlDeepDivesSeries } from "./ml-deep-dives";

export const SERIES_REGISTRY = {
  [mlDeepDivesSeries.id]: mlDeepDivesSeries,
} as const;

export type SeriesId = keyof typeof SERIES_REGISTRY;

export function getSeriesRegistry(seriesId: string) {
  return SERIES_REGISTRY[seriesId as SeriesId];
}
