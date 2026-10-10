---
author: Marco Schipani
pubDatetime: 2026-10-12T00:30:00Z
title: "Si aggrega il comportamento, non si memorizza l'id"
description: "La feature che si aggiorna da sola segue un attacco che cambia forma, senza aspettare il retrain."
featured: false
draft: true
series: detection-at-scale
seriesPart: 2
tags:
  - machine-learning
  - fraud-detection
---

> Bozza di lavoro, non è il pezzo. Tema, sezioni e fonti per scriverlo. Stile e citazioni come nella parte 1: il numero sta sulla cifra e quando cambia la fonte, le figure sono schizzi a matita con il blu del sito (`#006cac`).

## Da ricordare

La feature che si aggiorna da sola è il modo in cui il sistema segue un attacco che cambia forma, senza aspettare il retrain. Chi memorizza l’utente deve riaddestrare quando il comportamento cambia. Chi pubblica «quante volte, in che finestra, su che chiave» trova la feature già mossa.

## Tema

Il gradino di mezzo della parte 1: l’aggregatore che va a prendere «quante richieste nell’ultima ora». Lì il sistema si accorge di un attacco nuovo prima che qualcuno riscriva la regola o rifaccia il training.

Il drift, in questo pezzo, non è un capitolo a parte. È il motivo per cui la freshness esiste. Un picco su un merchant deve essere già visibile al pagamento successivo, anche su un altro merchant.

## Sezioni

### Il numero che deve essere già diverso

Aprire con il vincolo di Stripe in Shepherd: la fraud è avversariale, e la grandezza che pubblicano non è l’AUC. È la freshness. Se un business ha un picco anomalo, il valore della feature deve aggiornarsi prima che lo stesso schema colpisca il business dopo. Il modello SEPA ha più di 200 feature, batch e streaming. Risultato dichiarato: decine di milioni di dollari di frode in più bloccati in un anno.

### La stessa definizione, due volte

Il bug da raccontare è il training-serving skew. La feature di training e quella di serving sono due calcoli, e il modello impara un valore che in produzione non esiste. Shepherd fa girare la stessa definizione in Spark e in Flink, e simula nel training il ritardo del batch. Chronon di Airbnb è il contrasto sul meccanismo: la feature si dichiara una volta, il backfill è point-in-time, la consistency si misura dai log di fetch. L’esempio pubblicato da Airbnb sono i resi fraudolenti, letti al momento del checkout.

### Non è l’id

Dalla guida Radar, le feature concrete: «numero di paesi in cui questa carta è stata usata nelle ultime 24 ore», «i due IP più frequenti di questa carta». Il 90% delle carte sulla rete è già stata vista. L’embedding del merchant fa il resto del lavoro: Uber e Lyft finiscono vicini, un merchant nuovo eredita il pattern, uno schema visto in Brasile si riconosce negli Stati Uniti senza un altro training. Abnormal, sull’email, dice la stessa cosa con altri nomi: la frequenza di corrispondenza tra mittente e destinatario non si calcola da un messaggio solo. Il batch copre 180 giorni e 3 TB al giorno. Il realtime è un sistema a parte, e il dettaglio dei due orologi resta per la parte 5: qui basta dire che l’aggregato esiste prima dello score.

### Quello che il pezzo lascia in mano

La cascata della parte 1 firma l’azione. Questo pezzo firma il vettore. Senza un aggregato che si muove da solo, la regola veloce della parte 1 invecchia in poche settimane e l’unico rimedio è riscriverla.

## Figura

Un solo schizzo, due colonne.

A sinistra, una chiave che è un id: il modello ha una riga per quell’utente, e un utente nuovo è una cella vuota. A destra, una chiave che è un comportamento: finestra, conteggio, entità (carta, mittente, merchant). Una freccia verticale, «il valore si aggiorna», che non passa dal training.

Matita, carta calda, blu `#006cac` sul riquadro di destra. Stesse proporzioni delle figure della parte 1.

## Fonti

[1] Stripe, [«Shepherd: how Stripe adapted Chronon to scale ML feature development»](https://stripe.com/blog/shepherd-how-stripe-adapted-chronon-to-scale-ml-feature-development). Post di engineering. Testo primario. Prendere freshness, il picco che deve propagarsi al merchant successivo, le 200 feature del modello SEPA, lo skew del ritardo di batch, la cifra sui dollari bloccati. Non trasformarlo in un tutorial su Flink.

[2] Stripe, [«A primer on machine learning for fraud protection»](https://stripe.com/guides/primer-on-machine-learning-for-fraud-protection), sezione sul feature engineering. Guida per clienti. Prendere gli esempi di aggregati sulla carta, il 90% delle carte già viste, gli embedding di merchant e il trasferimento Brasile → Stati Uniti. Il break-even e la precision-recall restano per la parte 3. Le guardrail di rilascio restano per la parte 6.

[3] Airbnb, [«Chronon, Airbnb’s ML feature platform, is now open source»](https://medium.com/airbnb-engineering/chronon-airbnbs-ml-feature-platform-is-now-open-source-d9c4dba859e8). Post di engineering. Prendere l’esempio dei resi fraudolenti, la definizione unica online/offline, la misura di consistency sui log di fetch. Il post più vecchio sulla declarative API, [«Chronon — A declarative feature engineering framework»](https://medium.com/airbnb-engineering/chronon-a-declarative-feature-engineering-framework-b7b8ce796e04), serve solo se serve la frase sullo skew come motivo per cui Chronon è stato costruito.

[4] Abnormal AI, [«High-Scale Aggregation Systems in Production»](https://abnormal.ai/blog/ai-innovation-high-scale-aggregation-in-production). Post di engineering. Prendere la frequenza mittente-destinatario come feature che non esiste sul singolo messaggio, e la scala (180 giorni, 3 TB al giorno). Il disegno realtime contro batch è il tema della parte 5: citarlo, non raccontarlo per intero.

## Non rifare

La cascata regole-modelli-azione è la parte 1. I due calendari (conteggio nel minuto, peso nel retrain) sono la parte 5. L’IOC che si cambia a basso costo è la parte 4: qui l’IP entra solo come «i due IP più frequenti di questa carta», cioè come storia, non come lista nera.
