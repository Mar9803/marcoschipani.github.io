export const DETECTION_AT_SCALE_ID = "detection-at-scale";

export const detectionAtScaleSeries = {
  id: DETECTION_AT_SCALE_ID,
  displayName: "Detection at Scale",
  parts: [
    { part: 1, title: "Il modello arriva dopo la regola" },
    { part: 2, title: "Si aggrega il comportamento, non si memorizza l'id" },
    { part: 3, title: "La soglia è un conto, non una metrica" },
    { part: 4, title: "L'IOC è già vecchio quando lo pubblichi" },
    { part: 5, title: "Due orologi" },
    { part: 6, title: "Non si promuove un modello che è meglio solo in media" },
  ],
} as const;
