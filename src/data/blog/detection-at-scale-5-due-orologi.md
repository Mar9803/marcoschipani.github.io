---
author: Marco Schipani
pubDatetime: 2026-10-15T00:30:00Z
title: "Due orologi"
description: "Nel minuto si aggiorna il conteggio. Il peso del modello si muove su un altro calendario, e solo dopo una prova."
featured: false
draft: true
series: detection-at-scale
seriesPart: 5
tags:
  - machine-learning
  - fraud-detection
---

> Bozza di lavoro, non è il pezzo. Tema, sezioni e fonti per scriverlo. Stile e citazioni come nella parte 1.

## Da ricordare

Nel minuto si aggiorna il conteggio. Il peso del modello si muove su un altro calendario, e solo dopo una prova. Aggiornare la feature e aggiornare il peso sono due sistemi.

## Tema

La parte 1 ha chiuso con la frase di Uber: chi froda non aspetta il training. La parte 2 ha messo l’aggregato nel vettore. La parte 4 ha lasciato l’IOC come propagazione del primo colpo, non come strategia. Questo pezzo mostra i due calendari uno accanto all’altro, su email e su pagamenti.

## Sezioni

### Il conteggio è già pronto quando arriva il messaggio

Testo primario: Abnormal, gli aggregati in produzione. Il realtime scorer legge aggregati già calcolati. Il batch, su Spark e Airflow, risponde a domande da 180 giorni. I due sistemi sono stati separati per velocità, non perché siano la stessa pipeline con due orari. Dire chi legge cosa: lo scorer è un client degli store, non il posto in cui l’aggregato nasce.

### Senza il time travel il training vede il futuro

Abnormal, il rescoring degli attacchi passati. Per una feature «conteggio email a 30 giorni» devi rileggere il valore com’era nel momento del messaggio, non il valore di oggi. È il problema di scala che un lettore può portarsi a casa anche se non gestisce un prodotto email. Tenere il pezzo sul tempo, non sulla meccanica di Spark.

### L’altro orologio, stesso modello

Dalla guida Radar, la frase sul retrain. Rifare il training dello stesso modello, stesse feature, stessa architettura, sui dati più recenti, vale fino a mezzo punto di recall al mese. La freshness di Shepherd (parte 2) è l’orologio corto. Questo è l’orologio lungo. Non riaprire il break-even e non aprire ancora le guardrail per merchant: quelle sono la parte 6. Qui il fatto è la cadenza.

### Una versione a trimestre, e il tentativo di chiuderla

Cloudflare documenta il mondo precedente nelle note di rilascio dei modelli bot: una versione ogni tanto, da v2 a v9, ciascuna dedicata a una classe di traffico (HTTP/3, proxy residenziali, randomizzazione). Adaptive Intelligence descrive il tentativo di non aspettare quella release: retrain continuo sul traffico vivo. Le regole usa e getta sono già state raccontate nella parte 4. Qui resta il calendario del peso.

### La frase che tiene i due orologi

Richiamare Mastermind in una frase, senza ridisegnarlo: chi froda è più veloce del training, quindi il minuto non può essere un gradient step. Chiudere così: il primo colpo della parte 4 viaggia sull’orologio corto, dentro le feature. Il modello si riallinea sull’orologio lungo, quando la distribuzione dei clienti, non il burst, si è mossa.

## Figura

Due corsie orizzontali, stesso foglio.

Corsia alta, corta: evento → aggiorna il conteggio → decisione successiva. Didattica: «minuti». Corsia bassa, lunga: raccogli → feature → training → una prova → promuovi. Didattica: «settimane». Nessuna freccia che faccia salire il peso sulla corsia alta. Blu `#006cac` solo sulla decisione della corsia alta e sulla prova della corsia bassa.

## Fonti

[1] Abnormal AI, [«High-Scale Aggregation Systems in Production»](https://abnormal.ai/blog/ai-innovation-high-scale-aggregation-in-production). Post di engineering. Testo primario per l’orologio corto. Prendere realtime contro batch, lo scorer come client, 180 giorni, Spark e Airflow, 3 TB al giorno. La definizione di feature aggregata è già nella parte 2: non rispiegarla da zero.

[2] Abnormal Security, [«Re-scoring an ML detection engine on past attacks, part 2»](https://medium.com/abnormal-security-engineering-blog/re-scoring-an-ml-detection-engine-on-past-attacks-part-2-9e4d8d72188e). Post di engineering. Prendere il time travel: l’aggregato va riletto alla data del messaggio. La parte 1 dello stesso racconto, se serve il perché del rescoring (attacchi rari, avversariali, costo dell’errore), va citata come premessa, non come secondo sistema. Cercare il link della parte 1 dal post, e non inventare passaggi che il testo non ha.

[3] Stripe, [«A primer on machine learning for fraud protection»](https://stripe.com/guides/primer-on-machine-learning-for-fraud-protection), sezione *Machine learning operations*. Guida per clienti. Prendere solo il mezzo punto di recall al mese rifacendo il training a parità di feature e architettura, e la frase sul drift: i trend cambiano e il training smette di rappresentare la frode di oggi. Guardrail, distribuzioni degli score e controfattuale sono la parte 6.

[4] Cloudflare, [«Machine Learning models»](https://developers.cloudflare.com/bots/reference/machine-learning-models/) per la cadenza delle versioni, e [«Introducing Adaptive Intelligence»](https://blog.cloudflare.com/introducing-adaptive-intelligence/) per il retrain continuo. Il primo è documentazione. Il secondo è un post di prodotto. Prendere il contrasto di calendario. Le regole usa e getta restano nella parte 4.

[5] Uber Engineering, [«Mastermind»](https://www.uber.com/us/en/blog/mastermind/), 8 marzo 2017. Solo la frase già usata nella parte 1: chi froda è più veloce del training. Non ridisegnare il motore.

## Non rifare

Non rispiegare gli aggregati della parte 2. Non rifare l’IOC della parte 4, se non nella chiusura di una frase. Non anticipare il cancello per merchant della parte 6: la «prova» in figura è un segnaposto, e il pezzo successivo dice che cosa c’è scritto sopra.
