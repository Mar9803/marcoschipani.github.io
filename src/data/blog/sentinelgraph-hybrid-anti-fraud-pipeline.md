---
author: Marco Schipani
pubDatetime: 2026-06-03T10:00:00Z
title: "SentinelGraph: Engineering a Live, Hybrid Anti-Fraud Pipeline"
featured: false
draft: false
tags:
  - fraud detection
  - MLOps
  - SentinelGraph
description: "Architecture notes for a production-oriented hybrid pipeline — heuristic rules, XGBoost, and Autoencoder layers evaluated in real time."
---

<div style="text-align: center;">
  <a href="/marcoschipani.github.io/projects/sentinel/">
    <img
      src="/marcoschipani.github.io/slowLight.png"
      alt="SentinelGraph live anti-fraud lab dashboard"
      style="width: 100%; max-width: 1000px; height: auto; border-radius: 8px; border: 2px solid #555;"
    />
  </a>
</div>



**Welcome to the SentinelGraph Live Anti-Fraud Lab!** This project is engineered as an open, evolving **Live Build**. To capture the real engineering process, I am keeping this **"flight log"** to document and monitor every development phase as it happens—from the initial notebook sketches and infrastructure blueprints to, hopefully: real-time feature serving, versioned model deployment, and production drift detection.

Each of these topics is massive and could easily warrant its own dedicated project. Therefore, my primary objective remains to **document my self-studies**- done also for teh sake of showcasing my passion for real-time systems and directly applyng what I learn into a functional environment

Having a soft spot for linear algebra, I've always been fascinated by how PCA tackles the curse of dimensionality, or by the underlying geometry of latent spaces in Autoencoders, and so on. For that reason, I envision this flight log evolving into a hub packed with references to deep-dive theoretical articles, real-world MLOps production use cases, and technical papers I'll discover along the way.

Every complex system needs a starting point. To build SentinelGraph, I had to strip away the noise and define the foundational blueprint—the absolute baseline required to spark life into the pipeline. 

My **"minimal viable" architecture** of a real-time ML-powered system consists of:

- **Interactive Frontend:** A dashboard that provides not just binary decisions (*Fraud/Safe*), but transparent insights into why a decision was made.
- **Backend API (The Orchestrator):** The brain of the operation, responsible for routing traffic and managing the interplay between data and models.
- **Feature Store:** A dual-layer system (**Offline/Online**) designed to bridge historical context with sub-millisecond real-time speed.
- **Model Registry (Model Store):** A versioned hub for my **"three brains"**—*Rules Engine, XGBoost, and Autoencoders*—allowing for seamless deployment and rollback.
- **Monitoring & Drift Detection:** The system’s **"health check,"** crucial for identifying when the model loses its edge in a shifting market.

## Why a hybrid stack?

Having spent time in a **SOC (Security Operations Center)** as an analyst, I’ve lived on the other side of the glass, interacting daily with the static, deterministic rules of standard SIEMs. 

Yet, even with its rigid constraints, that environment gives you the distinct feeling of a living, breathing ecosystem. The daily routine of rule tuning, continuous network monitoring, updating alerting logic, and deciding what to automate versus what to handle manually—it is, in essence, the most natural form of a real-time system. It operates at a human pace, driven by strict protocols and constant evolution. 

Having managed this human-driven loop, my focus has naturally shifted toward expanding these capabilities through **real-time, ML-powered systems**.

Therefore, when searching for a project use case, anchoring myself to this direct experience made **anomaly/fraud detection** the most natural choice. 

However, as soon as I began developing the project, my attention shifted toward the architectural blind spots of traditional security centers. A standard SOC setup rarely addresses the lifecycle of a machine learning model, simply because it doesn’t deploy one. Yet, a SOC's operational loop suffers from its own form of **drift**: detection rules continuously deteriorate as attacker behaviors shift, requiring constant manual restoration and tuning. 

It is the exact same fundamental principle—systemic decay over time—but driven by different agents. Realizing that MLOps provides the automated engineering frameworks to manage this continuous lifecycle, counter model drift, and maintain system reliability is precisely what sparked my deep interest in the **MLOps lifecycle**.

Fraud at the edge is rarely a pure classification problem. Latency budgets, explainability for analysts, and shifting adversarial behavior push you toward **composable layers** rather than one monolithic scorer. 
For these reasons, I chose a hybrid, multi-layered defense stack to power this real-time pipeline, structuring it around  **distinct walls of defense**.

#### Layer 1: The Deterministic Wall (Static Rules)

The first line of defense is purely human-driven. It relies on static, deterministic rules that reflect the deep business logic and domain expertise of those who **curate** them. 
Crafting these rules is often the hardest part; it is where the experience of the analyst pays off. 

By implementing this first wall, I wanted to address an age-old engineering question: *When do you actually need Machine Learning? Are you sure you need it at all?* In many scenarios, you might realize that static rules catch 90% of the noise, keeping the system lightweight and delivering immediate, cost-effective value to the business. 

#### Layer 2: The Probabilistic Wall (The ML Ensemble)

When a threat bypasses domain logic, the second wall takes over. This is where Machine Learning enters the pipeline. Rather than chasing a mythical "perfect, universal model," this layer treats models as specialized entities, acknowledging that where one paradigm struggles, another might excel by orders of magnitude. 

- **XGBoost:** Deployed as our supervised heavyweight. It excels at parsing structured, tabular transaction data, learning complex non-linear interactions between features (like transaction frequency, geolocation shifts, and amount deltas) to flag known historical fraud patterns with high precision.
- **Autoencoders:** Deployed as our unsupervised anomaly detector. Unlike XGBoost, Autoencoders don't look for known fraud; they learn the underlying geometry of "normal" user behavior. By compressing data into a latent space, they catch **zero-day** threats and highly sophisticated, unseen fraud tactics based purely on reconstruction error.

This interplay between deterministic speed and probabilistic adaptation is what makes a real-time system feel like a living, breathing organism.

However, orchestrating this multi-model approach introduces a new layer of complexity. Managing multiple "brains" in a real-time ecosystem means carrying the weight of their entire operational lifecycle. You cannot just deploy them and walk away; you must ensure they remain reliable over time. 

This is where the core MLOps infrastructure becomes non-negotiable:

- **Drift Detection & Monitoring:** Serving as the system's continuous vital check, tracking performance degradation and statistical shifts in data distributions before they impact the business.
- **Feature & Model Stores:** Operating as the source of truth, ensuring that both training and real-time inference share the exact same data features and versioned models without friction.

Ultimately, this project is less about the models themselves and more about engineering the resilient infrastructure that allows them to survive, adapt, and remain trustworthy in a production environment.

## Try the live lab

The interactive dashboard lives on the portfolio:

<div>
  <a href="/marcoschipani.github.io/projects/sentinel/" class="live-lab-cta">
    OPEN THE LIVE LAB
    <span class="live-lab-cta-arrow">→</span>
  </a>
</div>

<style>
  .live-lab-cta {
    display: inline-flex;
    align-items: center;
    color: #1e9aa3;
    text-decoration: none;
    font-weight: 600;
    font-family: monospace;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
  }
  .live-lab-cta:hover {
    color: #4fc3f7;
    transform: translateX(5px);
  }
  .live-lab-cta-arrow {
    margin-left: 8px;
    font-size: 1.2rem;
  }
</style>

> ☕ **A quick note before you dive in:** The backend is currently hosted on a free-tier server. If the dashboard feels a bit sleepy at first, give it about 30 seconds to wake up and drink its morning coffee. Once it's up, you're good to go!