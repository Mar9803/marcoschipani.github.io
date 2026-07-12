export const ML_DEEP_DIVES_ID = "ml-deep-dives";

export const mlDeepDivesSeries = {
  id: ML_DEEP_DIVES_ID,
  displayName: "[ML Deep Dives]",
  parts: [
    { part: 1, title: "The Linear Algebra of PCA" },
    { part: 2, title: "Logistic Regression & The Geometry of L1/L2" },
    { part: 3, title: "Tree-Based Boosting with XGBoost" },
    { part: 4, title: "Confusion Matrix and Related Metrics" },
    { part: 5, title: "Neural Representation via Autoencoders" },
  ],
} as const;
