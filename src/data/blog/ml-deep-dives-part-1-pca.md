---
author: Marco Schipani
pubDatetime: 2026-07-12T10:00:00Z
title: "[ML Deep Dives] Part 1: The Linear Algebra of PCA"
description: "A mathematical deep dive into Principal Component Analysis, exploring eigenvectors, eigenvalues, and variance maximization."
featured: false
draft: false
series: ml-deep-dives
seriesPart: 1
tags:
  - machine-learning
  - statistics
---

Principal Component Analysis (PCA) is often introduced as a "dimensionality reduction trick." Under the hood, it is a **variance-maximizing rotation** of a centered dataset, expressed entirely in the language of linear algebra: covariance, eigen-decomposition, and orthogonal projections.

This article builds the geometric intuition step by step, from raw features to the principal subspace.

## 1. Centering the Data

Given a design matrix $X \in \mathbb{R}^{n \times p}$ with $n$ observations and $p$ features, we first center each column:

$$
\bar{x}*j = \frac{1}{n}\sum*{i=1}^{n} x_{ij}, \qquad
\tilde{x}*{ij} = x*{ij} - \bar{x}_j
$$

Let $\tilde{X}$ denote the centered matrix. PCA operates on the **second-moment structure** of $\tilde{X}$, not on raw offsets.

## 2. The Covariance Matrix

When features are comparable in scale (or after standardization), the sample covariance matrix is:

$$
\Sigma = \frac{1}{n-1}\tilde{X}^\top \tilde{X} \in \mathbb{R}^{p \times p}
$$

Each entry $\Sigma_{jk}$ measures how feature $j$ co-varies with feature $k$. PCA asks:

> **Which directions in $\mathbb{R}^p$ capture the largest shared variance?**

Those directions are the **eigenvectors** of $\Sigma$.

## 3. Eigenvalues and Eigenvectors

We solve the symmetric eigenproblem:

$$
\Sigma v_k = \lambda_k v_k, \qquad v_k_2 = 1
$$

with eigenvalues ordered $\lambda_1 \geq \lambda_2 \geq \cdots \geq \lambda_p \geq 0$.


| Object                                 | Role in PCA                                        |
| -------------------------------------- | -------------------------------------------------- |
| **Eigenvector** $v_k$                  | $k$-th principal axis (direction in feature space) |
| **Eigenvalue** $\lambda_k$             | Variance explained along $v_k$                     |
| **Score** $t_i = \tilde{x}_i^\top v_k$ | Projection of observation $i$ onto axis $k$        |


The total variance tracked by $\Sigma$ is $\mathrm{tr}(\Sigma) = \sum_{k=1}^{p} \lambda_k$. The fraction explained by the first $m$ components is:

$$
\frac{\sum_{k=1}^{m} \lambda_k}{\sum_{k=1}^{p} \lambda_k}
$$

## 4. Matrix Form: Spectral Decomposition

Because $\Sigma$ is symmetric positive semi-definite:

$$
\Sigma = V \Lambda V^\top
$$

where $V = [v_1 \mid v_2 \mid \cdots \mid v_p]$ is orthogonal and $\Lambda = \mathrm{diag}(\lambda_1, \ldots, \lambda_p)$.

Projecting onto the top-$m$ subspace is equivalent to:

$$
Z = \tilde{X} V_m
$$

with $V_m \in \mathbb{R}^{p \times m}$ holding the first $m$ eigenvectors.

## 5. Connection to SVD (Optional but Powerful)

When $n \neq p$ or $p$ is large, practitioners often use the SVD of $\tilde{X}$:

$$
\tilde{X} = U S V^\top
$$

Then $\Sigma = \frac{1}{n-1} V S^2 V^\top$: **right singular vectors** of $\tilde{X}$ coincide with PCA axes, and **squared singular values** (scaled) are the eigenvalues.

> **Engineering note:** SVD is numerically stable and avoids explicitly forming $\tilde{X}^\top \tilde{X}$ when $p$ is huge.



## 6. Visual Intuition (Matplotlib Placeholders)







**Figure 1 (placeholder):** 2D scatter with mean-centered data and the first two principal axes $v_1, v_2$.







**Figure 2 (placeholder):** Scree plot for choosing $m$ via the elbow in $\lambda_k$.





**Figure 3 (placeholder):** Scores $t_1, t_2$ colored by a known label (sanity check that separation emerges).

## 7. What to Watch For

- **Scale sensitivity:** PCA on unscaled features can be dominated by large-magnitude columns. Standardize when units differ.
- **Linearity:** PCA finds **linear** structure. Non-linear manifolds need other tools (kernel PCA, autoencoders — see Part 5).
- **Interpretability:** Each $v_k$ is a linear combination of *all* original features; sparsity is not built in (contrast with Part 2).



## 8. Summary

PCA = center $\rightarrow$ estimate $\Sigma$ $\rightarrow$ eigendecompose $\rightarrow$ project.

The eigenvectors are the **directions of maximal remaining variance**; the eigenvalues tell you **how much** each direction matters. Everything else in production pipelines—retained components, whitening, reconstruction error—flows from this decomposition.

---

*Next in the series: **Part 2 — Logistic Regression & The Geometry of L1/L2** — how penalty geometry reshapes coefficient paths in high dimensions.*