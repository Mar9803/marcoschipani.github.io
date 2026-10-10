---
author: Marco Schipani
pubDatetime: 2026-10-14T00:30:00Z
title: "L'IOC è già vecchio quando lo pubblichi"
description: "Hash, dominio e IP sono artefatti che l'attaccante sostituisce. Quello che resta è il comportamento rispetto a una storia."
featured: false
draft: true
series: detection-at-scale
seriesPart: 4
tags:
  - machine-learning
  - fraud-detection
  - cybersecurity
---

> Bozza di lavoro, non è il pezzo. Tema, sezioni e fonti per scriverlo. Stile e citazioni come nella parte 1.

## Da ricordare

L’indicatore statico (hash, dominio, IP) è un artefatto che l’attaccante sostituisce a basso costo. Quello che resta è il comportamento rispetto a una storia. L’IOC non si butta: smette di essere la strategia, e torna utile solo dopo, per propagare il primo giudizio al resto del burst.

## Tema

È il pezzo in cui la serie esce dai pagamenti. Lo stesso argomento vale per un proxy residenziale, per una signature e per una mail. La parte 2 ha già mostrato l’IP come storia della carta («i due IP più frequenti»). Qui l’IP è una lista. Le due cose vanno tenute distinte, con una frase, senza rifare Shepherd.

## Sezioni

### La lista che l’attaccante ha già previsto di cambiare

Testo primario: Cloudflare sui bot che passano dai proxy residenziali. Rate limit e reputation dell’IP tengono finché l’operatore non compra un altro spazio di indirizzi, residenziale, e si confonde con il traffico buono. Il modello v8 sposta peso su fingerprint della richiesta, segnali di comportamento e statistiche di rete. Non stanno dicendo che l’IP è inutile. Stanno dicendo che, da solo, è una lista già prevista.

### Il nome della distinzione

CrowdStrike, IOA contro IOC, solo per il vocabolario, e va detto che è una pagina di prodotto, non un design doc. L’IOC è forense e arriva dopo. L’IOA è una sequenza e un intento, e vale anche quando il malware non c’è: nel loro report 2022, il 62% degli attacchi era malware-free. Usarla per il nome. Il design resta quello di Cloudflare.

### Anche chi ha fatto della normalità il prodotto tiene le signature

Abnormal, *From Data to Detection*: un messaggio da outlook.com non è un segnale; lo diventa insieme al link, alle keyword, alla storia. Il post parla ancora di signature accanto ai modelli. Dirlo. L’evoluzione non è «si butta l’IOC». È «l’IOC non è più la strategia».

### Regole che non restano abbastanza a lungo da essere studiate

Cloudflare, Adaptive Intelligence: regole usa e getta, che compaiono e spariscono, così chi attacca non ha un sì/no stabile su cui addestrarsi. È l’economia dell’attaccante. Il costo di adattarsi deve restare dalla sua parte. Il retrain continuo dello stesso annuncio è il secondo orologio: nominarlo e lasciarlo alla parte 5.

### Dopo il primo colpo

Chiudere sul ruolo che all’IOC resta. Il comportamento, rispetto alla storia del bersaglio, prende il primo caso. L’indicatore serve subito dopo, per il burst di messaggi o richieste che portano lo stesso dominio. Prima di quel momento è una lista morta. Questo aggancio prepara la parte 5 senza raccontare Redis o il time travel.

## Figura

Due strisce, stesso foglio.

Sopra: un elenco di IP e di hash, barrato a matita, con una freccia «l’attaccante lo cambia». Sotto: una sequenza corta (richiesta, storia del destinatario, scostamento) che porta a un solo giudizio, e da quel giudizio una freccia laterale verso «gli altri con lo stesso indicatore». Blu `#006cac` solo sul giudizio, non sulla lista.

## Fonti

[1] Cloudflare, [«Using machine learning to detect bot attacks that leverage residential proxies»](https://blog.cloudflare.com/residential-proxy-bot-detection-using-machine-learning/). Post di engineering. Testo primario. Prendere la rotazione dello spazio IP, il fallimento di rate limit e reputation, e lo spostamento del v8 su comportamento e rete. Non fare la storia di tutte le versioni del modello: quella cadenza è la parte 5.

[2] CrowdStrike, [«IOA vs IOC»](https://www.crowdstrike.com/en-us/cybersecurity-101/threat-intelligence/ioa-vs-ioc/). Pagina di prodotto. Prendere solo il vocabolario: IOC forense, IOA come sequenza e intento. Il 62% malware-free è nel post [«Introducing AI-powered IOAs»](https://www.crowdstrike.com/en-us/blog/introducing-ai-powered-indicators-of-attack-ioas/), citato come loro report 2022. Non usare queste pagine come fonte del design.

[3] Abnormal AI, [«From Data to Detection: Crafting AI for Email Threat Detection»](https://abnormal.ai/blog/crafting-ai-for-email-threat-detection). Post di engineering. Prendere il fatto che un segnale di superficie non basta, e il fatto che le signature restano accanto ai modelli. Gli aggregati mittente-destinatario sono la parte 2 e la parte 5.

[4] Cloudflare, [«Introducing Adaptive Intelligence»](https://blog.cloudflare.com/introducing-adaptive-intelligence/). Post di prodotto. Prendere le regole usa e getta e il motivo: non lasciare all’attaccante un’etichetta stabile. Il retrain continuo si nomina e si lascia alla parte 5.

## Non rifare

La parte 2 ha già l’aggregato come storia. Qui la tesi è che l’indicatore statico, da solo, è già vecchio. Non riaprire freshness, skew, Chronon.
