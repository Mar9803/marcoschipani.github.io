---
author: Marco Schipani
pubDatetime: 2026-10-11T15:00:00Z
title: "L'incrocio è un certificato"
description: "A subdivision of K3,3 forces a crossing in every drawing. In an investigation that crossing is a certificate, not an alert."
featured: false
draft: false
series: il-disegno-non-e-il-grafo
seriesPart: 2
tags:
  - graph-theory
  - fraud-detection
---

Picture an analyst in front of a money-laundering case that has spread across several banks and ended up as a tangle of <strong>fifteen accounts</strong>. She has two jobs, to flag the mule accounts and to flag the transactions, and it is precisely there that Feedzai, working with Mastercard, begins. [1] A force-directed layout, they note, becomes hard to read somewhere between twenty and a hundred nodes, depending on density, but their real constraint is tighter than that: a bank has to stay on a single row and time has to stay on a single axis, and force-directed drawings guarantee neither. So they fix both, placing the victim account on the left, each account on the row of its own bank, and each account horizontally at the moment of its first transaction.

Then they thin the picture out. Accounts can be grouped by amount, when they fall below a threshold set against the largest movement, or by time, when their transactions land within one, twelve or twenty-four hours of each other, or by both conditions at once, and every group collapses into a <strong>meta-node</strong> while parallel edges merge into one. In their study, three risk consultants all picked the amount-based method when the goal was reducing visual noise, since it removes the most nodes, yet two of them preferred the methods that keep the original flow of the case, because a cleaner graph loses nuance and recovering it is extra work. No method suits every scheme, and the default they propose is the twenty-four-hour window. [1]

### Under the picture

What the analyst ends up looking at, however, is a different graph from the one she started with, a smaller one built by aggregation, and moving the dots of the original graph around is an altogether different operation.

<blockquote class="def">
<p>If that original graph contains a subdivision of $K_{3,3}$, every drawing in the plane must put at least one <strong>crossing</strong> on it. The theorem does not fix which pair of paths crosses. It guarantees that some pair does.</p>
</blockquote>

The teal vertices form one side and the amber ones the other, while the black vertex of degree 2 is just an intermediary threaded onto an edge and does nothing to dissolve the obstruction. The two red edges in the right-hand panel are a pair that happens to cross in this particular drawing.

<figure style="margin: 2rem auto; text-align: center;">
  <img
    src="/marcoschipani.github.io/disegno-certificato.png"
    alt="Two panels of the same graph. On the left, accounts, counterparties and an intermediary. On the right, the same vertices, with the two crossing edges marked in red: a subdivision of K3,3."
    style="width: 100%; max-width: 980px; height: auto; border-radius: 6px; display: block; margin: 0 auto 0.75rem auto;"
  />
  <figcaption style="font-style: italic; font-size: 0.9rem; opacity: 0.7; max-width: 980px; margin: 0 auto;">
    <strong>Figure 1.</strong> The same subgraph, twice. On the left, with the names of the case. On the right, the subdivision of $K_{3,3}$. In this drawing the two red edges cross. In another drawing the crossing can change pair, and it stays inside the subgraph.
  </figcaption>
</figure>

<blockquote class="def">
<p>Feedzai never runs this test. Their question is <strong>legibility</strong>, how many marks to leave on a bank’s row. The crossing is already in the graph, and the meta-node escapes it only by changing the vertices.</p>
</blockquote>

### The certificate inside the layout

That same subgraph is what a drawing algorithm actually uses when it wants to minimize crossings. Chimani, Mutzel and Schmidt extract many Kuratowski subdivisions at once, in time linear in the size of the graph plus the size of the certificates, to feed a branch-and-cut: solve a relaxation, look for a subdivision in the graph of the integer interpretation, and turn each one found into a cut, since that subgraph must contain at least one crossing or the current solution is infeasible. [2]

<blockquote class="def">
<p>It is the same object as in this series: a <strong>certificate</strong> inside the layout solver. A detection rule is a different object.</p>
</blockquote>

### Before the drawing, the vertices

Even before the drawing, though, comes the question of what counts as a vertex. Quantexa places that step first: in the dynamic tier of its platform, entities are resolved, then the graph is built, then the score is computed. [3] Its graph analytics page describes what follows, connections and flows and financial crime as an exploration of that graph, [4] and in its QKnowledge Graph library the raw bipartite graph is declared unsuitable for most algorithms, so the work moves to a metagraph, a perspective on vertices already resolved. [5]

<blockquote class="def">
<p>Merging two records into one vertex changes the <strong>isomorphism class</strong> before anyone has chosen a stroke. <strong>Entity resolution</strong> is the moment when one decides which graph is about to be drawn.</p>
</blockquote>

Two accounts wrongly kept apart become two vertices whose edges may form another $K_{3,3}$. ING uses the platform for KYC and AML, starting with trade finance, [6] but the public document is an adoption announcement, so the technical fact worth citing remains the one in the product documentation: entities, then graph, then score.

### Where this series stops

This series stops at the drawing. A star is planar and so is a cycle, the shapes of fan-out and of money coming back, and both can be drawn without a single crossing, as part 1 already showed by separating them from the subdivision of $K_{3,3}$.

<blockquote class="def">
<p>In a detection system the alert remains the <strong>cycle</strong>, or the cut, or an aggregate over behavior. The crossing that cannot be removed is the certificate the layout must pay for, or that aggregation sidesteps by building another graph.</p>
</blockquote>

### Sources

[1] Salome Esteves, Rita Costa, Louise Fallon, Pedro Bizarro, [«The Balance between Nuance and Clarity: Decluttering Tabular Sequential Graphs to Counter Money Laundering»](https://research.feedzai.com/oshuzuxa/2026/07/IEEEVis__The_Balance_between_Nuance_and_Clarity__Decluttering_Tabular_Sequential_Graphs_to_Counter_Money_Laundering.pdf), IEEE VIS 2026, author’s version. Feedzai; Fallon is at Mastercard. I took the readability range of force-directed layouts, the fifteen accounts, the two tasks of the analyst, the tabular sequential graph, the three groupings, and the outcome of the study with the three consultants. There is no planarity test in the paper.

[2] Markus Chimani, Petra Mutzel, Jens M. Schmidt, [«Efficient Extraction of Multiple Kuratowski Subdivisions»](https://algo.uni-rostock.de/storages/uni-rostock/Alle_IEF/Inf_ALGO/Publications/Chimani2007.pdf), technical report, then Graph Drawing 2007. I took the use of the subdivisions as cuts in the branch-and-cut for crossing minimization, and the fact that extracting several of them strengthens the relaxation. The minor-type detail stays in the paper.

[3] Quantexa, [«Architecture for Cloud Providers»](https://www.quantexa.com/assets/x/d516bcfcc5/architecture_for_cloud_providers-master-1.pdf). Architecture note. I took the order of the dynamic tier: resolve entities, build the graph, compute the score.

[4] Quantexa, [«Graph Analytics»](https://www.quantexa.com/platform/graph-analytics/). Product page. I took the place of the picture: after the graph built on resolved entities, to investigate flows and financial crime.

[5] Quantexa, [«AI at Quantexa»](https://community.quantexa.com/kb/getting-started-on-the-quantexa-platform/ai-at-quantexa/39130), notes on the QKnowledge Graph library. I took the line on the raw bipartite graph, unsuitable for most algorithms, and the move to a metagraph. PageRank and graph neural networks, mentioned on the same page, stay out of this piece.

[6] The Paypers, [«Quantexa strengthens and automates global risk coverage for ING»](https://thepaypers.com/fraud-and-fincrime/news/quantexa-strengthens-and-automates-global-risk-coverage-for-ing). Announcement. I took only the adoption for KYC and AML, starting with trade finance. It is not a source on drawing.
