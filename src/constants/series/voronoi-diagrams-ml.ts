export const VORONOI_DIAGRAMS_ML_ID = "voronoi-diagrams-ml";

export const voronoiDiagramsMlSeries = {
  id: VORONOI_DIAGRAMS_ML_ID,
  displayName: "[Voronoi Diagrams teaching Machine Learning]",
  parts: [
    { part: 1, title: "Centroidal Voronoi Tessellations" },
    { part: 2, title: "Fortune's Sweep-Line Algorithm" },
    { part: 3, title: "K-Means and Voronoi Tessellations" },
  ],
} as const;
