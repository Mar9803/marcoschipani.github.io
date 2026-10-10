---
author: Marco Schipani
pubDatetime: 2026-10-13T00:30:00Z
title: "La soglia è un conto, non una metrica"
description: "Il modello disegna la curva. La policy sceglie il punto, e quel punto dipende dal margine."
featured: false
draft: true
series: detection-at-scale
seriesPart: 3
tags:
  - machine-learning
  - fraud-detection
---

> Bozza di lavoro, non è il pezzo. Tema, sezioni e fonti per scriverlo. Stile e citazioni come nella parte 1.

## Da ricordare

Il modello disegna la curva precision-recall. La policy sceglie il punto su quella curva. Quel punto dipende dal margine di chi vende, non da una accuracy.

## Tema

Nella parte 1 la regola firma l’azione, e Uber nel 2017 non aveva ancora il contatore. Questo pezzo è quel contatore, letto sui soldi. Un falso negativo e un falso positivo non costano la stessa cosa, e non costano la stessa cosa a due merchant diversi.

## Sezioni

### Due problemi, una curva

Aprire sulla distinzione che Stripe scrive nella guida Radar. La data science cambia la forma della curva, aggiungendo feature e dati. Il business sceglie la soglia, cioè dove operare. Precision è la frazione di ciò che blocchi che è davvero frode. Recall è la frazione di frode che prendi. Alzare la soglia alza la precision e abbassa la recall. Tenere separati i due problemi: una curva migliore e un punto operativo più adatto non sono la stessa decisione.

### Il pareggio

Pubblicare il conto di Stripe, con i loro numeri. Vendita media 26 dollari, margine 8%, profitto circa 2,08 dollari. Costo del bene più fee di chargeback da 15 dollari: una frode costa circa 38,92 dollari, il profitto di circa 19 vendite buone. La precision di pareggio sta intorno al 5%. Con i margini del food si allarga la rete. Con i margini di un SaaS, un falso rifiuto costa più della frode. Nel survey che citano, il 33% dei consumatori non torna dopo un falso decline. In *How we built it* il numero di sistema è un altro: sotto i 100 millisecondi, più di 1.000 segnali, 0,1% di pagamenti legittimi bloccati. Usarlo come scala, non come secondo tema.

### Lo slice, non la media

Il contrasto è Cloudflare sul monitoraggio dei modelli di bot detection. Un rilascio ha alzato i falsi positivi sugli ASN residenziali, dove il traffico umano è la norma. Il monitoraggio per slice ha mostrato il calo, e hanno fermato il rollout prima che arrivasse alla maggior parte dei datacenter. È il costo del falso allarme con un incidente e un rollback. Il rollback come cancello di promozione si rilegge nella parte 6: qui l’incidente serve a dire che la media nasconde lo slice.

### L’etichetta arriva tardi

Uber, sui segnali di chargeback anticipati, è il limite del testo Stripe. La label buona non è la dispute, che matura dopo. Il TC40 arriva in media 4–5 giorni prima. Chi valuta solo sulla dispute sta misurando il passato. Chiudere sul fatto che la soglia si sceglie su un conto, e quel conto è vero solo se la label è quella giusta e lo slice è quello del merchant.

## Figura

Uno schizzo solo.

Una curva precision-recall disegnata a matita. Due punti sulla curva, non uno: uno per un margine stretto (food), uno per un margine largo (SaaS). Sotto, una riga di conto con i numeri di Stripe (26 dollari, 8%, fee 15). Niente grafico da paper. Stesso trattamento a matita della parte 1, blu `#006cac` sul punto, non su tutta la curva.

## Fonti

[1] Stripe, [«A primer on machine learning for fraud protection»](https://stripe.com/guides/primer-on-machine-learning-for-fraud-protection), sezioni su precision, recall, curve e break-even. Guida per clienti. Testo primario. Prendere la separazione tra forma della curva e punto operativo, le definizioni, e il conto del pareggio con le cifre pubblicate. Gli aggregati e gli embedding sono la parte 2. Le guardrail per merchant e il controfattuale sui pagamenti bloccati sono la parte 6: nominarli solo se serve a non far credere che la curva di validazione sia la curva di produzione.

[2] Stripe, [«How we built it: Stripe Radar»](https://stripe.dev/blog/how-we-built-it-stripe-radar). Post di prodotto/engineering. Prendere solo i tre numeri: sotto i 100 millisecondi, più di 1.000 segnali, 0,1% di pagamenti legittimi bloccati. Non aprire l’architettura del modello.

[3] Cloudflare, [«Monitoring machine learning models for bot detection»](https://blog.cloudflare.com/monitoring-machine-learning-models-for-bot-detection/). Post di engineering. Prendere l’incidente dei falsi positivi sugli ASN residenziali e il rollback prima del resto dei datacenter. Non raccontare qui l’intero sistema di alerting: torna nella parte 6 come cancello.

[4] Uber Engineering, [«How Uber processes early chargeback signals»](https://www.uber.com/us/en/blog/how-uber-processes-early-chargeback-signals/). Post di engineering. Prendere il TC40 che arriva 4–5 giorni prima della dispute, e il fatto che quel segnale entra nelle feature e nella decisione. Non rifare il flusso di Mastermind.

## Non rifare

La parte 1 ha già detto che una regola si misura come un modello, con disputed, refunded e accepted. Qui si spiega perché quel conteggio è un conto economico. La parte 6 spiega come si evita di promuovere un modello che vince solo in media.
