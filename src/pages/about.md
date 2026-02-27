---
title: "About Me"
layout: ../layouts/AboutLayout.astro
description: "Mathematician, Cyber Analyst and Software Enthusiast."
---
I am a mathematician into Cybersecurity. It is nice to see network defense as a large-scale modeling problem,  where algebra, graph theory, and automation meet to solve real-world security challenges.
 
### Numerical Analysis & Image Processing
I focused my research experience on the filed of image and signal reconstruction through high-order interpolants. Specifically, I investigated **monotone-preserving** techniques to mitigate non-physical oscillations.

#### The Problem: Accuracy vs. Monotonicity
The univariate case is well known, and there are elegant results addressing the problem of reconstructing data flows characterized by sudden shocks—or more accurately, jumps—technically referred to as $C^1$ discontinuities.

> **A trade-off:**  Regions with enforced monotonicity constraints typically correspond to lower formal accuracy, and vice versa.

Starting from the 1D studies available in the literature, I focused my research on extending existing properties to the bivariate case. The choice, made at the very beginning, was to adopt **Cubic Hermite Interpolators** for two main reasons:

* **First**: They represent a classic approach to managing discontinuities while preserving the data's shape, a concept widely explored in Computational Fluid Dynamics (CFD) literature.
* **Second**: By construction, these interpolants depend heavily on the approximation of the derivatives. Therefore, a common approach is to "try-building" diverse derivatives—adopting different means to approximate them—and *voilà*, you have your shape-preserving reconstruction.

As with almost every problem in mathematics, increasing the dimension often destroys the "nice" properties found in lower dimensions. Consequently, in the 2D case, only a few of the necessary and sufficient conditions for the monotonicity of the interpolant proved to be approachable, even from a purely numerical standpoint.

So, the aim was to construct algorithms by adopting different derivative estimators to ensure a reliable and artifact-free reconstruction. I explored the reconstruction of images and general data flows, where the objective is to find interpolants that are **shape-preserving**—specifically monotone-preserving—to eliminate phenomena such as **Gibbs oscillations** (spurious oscillations).

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
  <figure>
    <img src="\public\1D.png" alt="1D" />
    <figcaption style="font-size: 0.85em; line-height: 1.2; margin-top: 10px;">
      <strong>1. Univariate Case:</strong> Diverse Non-linear estimators used to reconstruct a function with jumps.
    </figcaption>
  </figure>
  <figure>
    <img src="\public\2D.png" alt="2D" />
    <figcaption style="font-size: 0.85em; line-height: 1.2; margin-top: 10px;">
      <strong>2. Bivariate Case:</strong> Monotone-preserving reconstruction of a 2D surface. 
    </figcaption>
  </figure>
</div>

### Graph Theory & Anomaly Detection
I have a strong interest in **Graph Theory**, and modeling through graphs.  particularly in **planarity problems**. In the cyber world, I relate this to **Network Topology Analysis**:
* **Graph-based Detection**: Instead of simple logs, I see network traffic as a dynamic graph.
* **Structural Anomalies**: I'm exploring how changes in graph centralities or the appearance of unexpected edges can signal lateral movement or C2 activities.

---

## 🛡️ Microsoft Azure & Sentinel Operations

I am currently blue teaming as a **SOC Analyst**, and my dayly key-words are:

* **KQL (Kusto Query Language)** 💎: My primary tool for querying and correlating security telemetries across **EDR** (Endpoint Detection and Response), firewalls, and identity providers. I use it to build complex hunting logic that connects disparate data points into a coherent attack narrative.
* **Workbooks** 📊: I develop these to transform fragmented logs into centralized, interactive dashboards. They are essential for visualizing the "blast radius" of an incident and providing a clear, quantitative view of the infrastructure's security posture.
* **Playbooks** ⚙️: Leveraging **Logic Apps** to automate repetitive triage tasks. These orchestrations integrate with **OSINT** 🔍 sources to automatically enrich alerts with external threat intelligence, significantly reducing the Mean Time to Respond (MTTR).
---

## 🔭 Learning Goals


* Getting in  **Anomaly Detection**: I like to deduce hacker behavior through analytics. I aim to design and implement Anomaly Detection pipelines. 🚀

* Implementing MLOps orchestration, mastering Docker.

