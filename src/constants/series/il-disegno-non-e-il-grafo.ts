export const DISEGNO_GRAFO_ID = "il-disegno-non-e-il-grafo";

export const disegnoGrafoSeries = {
  id: DISEGNO_GRAFO_ID,
  displayName: "The drawing is not the graph",
  parts: [
    { part: 1, title: "Two drawings, one graph" },
    { part: 2, title: "The crossing is a certificate" },
  ],
} as const;
