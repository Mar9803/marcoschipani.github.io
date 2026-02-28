---
author: Marco Schipani
pubDatetime: 2024-05-20T12:00:00Z
title: "Beyond the Shocks: Shape-Preserving Reconstruction in 2D Data Flows"
postSlug: beyond-the-shocks-2d-reconstruction
featured: true
draft: false
tags:
  - Numerical Analysis
  - Image Processing
  - Mathematics
  - Data Science
description: "Exploring the trade-off between accuracy and monotonicity in image and signal reconstruction."
---



### The Problem: Accuracy vs. Monotonicity ⚖️

In the univariate case, reconstructing data with $C^1$ discontinuities (jumps) is a well-understood challenge. However, it presents a classic mathematical trade-off: **Accuracy vs. Monotonicity**.

> **The real trade-off:** Regions with enforced monotonicity constraints typically correspond to lower formal accuracy, and vice versa. 

In other words, if we push for **high-order accuracy** (perhaps needing a sharper image in a specific region), we often trigger **non-physical oscillations**. Conversely, if we enforce strict monotonicity, we risk losing the fine details of the signal. 

To address this, my research focused on extending 1D properties to the **bivariate case**. The choice, made at the very beginning, was to adopt **Cubic Hermite Interpolators** for two main reasons:

1.  **Industrial Standard:** These interpolants are a cornerstone in fields like *Computational Fluid Dynamics (CFD)* and *Computer-Aided Design (CAD)* for managing discontinuities while preserving the data’s physical shape. 🛠️
2.  **Derivative Approximation:** By construction, these interpolants depend heavily on how derivatives are approximated. This allows for a "building-block" approach: adopting different **non-linear means** to approximate derivatives and—*voilà*—you have your shape-preserving reconstruction.

---

### 🌀 Moving to 2D: The "Curse" of Dimensionality

As with almost every problem in mathematics, increasing the dimension often destroys the "nice" properties found in lower dimensions. In the bivariate case, finding necessary and sufficient conditions for monotonicity is both **computationally and theoretically daunting**.

My research specifically focused on:
* **Extension:** Mapping 1D monotonicity properties onto 2D grids.
* **Algorithm Development:** Creating different derivative estimators to ensure a reliable, artifact-free reconstruction. 

I explored the reconstruction of images and general data flows, aiming for interpolants that are **monotone-preserving** to eliminate phenomena such as **Gibbs oscillations** (spurious oscillations). 🚫〰️

---

### 📊 Experimental Results

The following figures illustrate the core of my research results:

<div style="display: flex; flex-direction: column; gap: 50px; margin: 40px 0;">
  
  <figure style="margin: 0; width: 100%;">
    <img src="/marcoschipani.github.io/1D.png" 
         alt="1D Case" 
         style="border-radius: 8px; border: 1px solid #333; width: 100%; height: auto; display: block;" />
    <figcaption style="font-size: 0.9rem; margin-top: 12px; color: #888; text-align: center;">
      <strong>1. Univariate Case:</strong> Diverse non-linear estimators used to reconstruct a function with jumps.
    </figcaption>
  </figure>

  <figure style="margin: 0; width: 100%;">
    <img src="/marcoschipani.github.io/2D.png" 
         alt="2D Case" 
         style="border-radius: 8px; border: 1px solid #333; width: 100%; height: auto; display: block;" />
    <figcaption style="font-size: 0.9rem; margin-top: 12px; color: #888; text-align: center;">
      <strong>2. Bivariate Case:</strong> Monotone-preserving reconstruction of a 2D surface. 
    </figcaption>
  </figure>
</div>

These images represent the practical outcome of the algorithms I developed: on the left, you can see how different estimators behave under "stress" (jumps), while on the right, the 2D surface remains **clean and stable**, completely free from the typical "ringing" artifacts that usually plague high-order methods.

---

### 💡 Final Thoughts: Why This Matters

This research isn't just about "cleaner" graphs. In a world driven by data, the ability to **preserve the integrity of a signal** during reconstruction is vital.  Whether it's medical imaging, satellite data, or anomaly detection in cybersecurity, the math remains the same: **distinguishing the real shock from the numerical noise.** 🚀

---