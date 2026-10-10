---
author: Marco Schipani
pubDatetime: 2026-10-16T00:30:00Z
title: "Non si promuove un modello che è meglio solo in media"
description: "Un guadagno aggregato può essere una regressione per i merchant piccoli, e i pagamenti bloccati non hanno label."
featured: false
draft: true
series: detection-at-scale
seriesPart: 6
tags:
  - machine-learning
  - fraud-detection
---

> Bozza di lavoro, non è il pezzo. Tema, sezioni e fonti per scriverlo. Stile e citazioni come nella parte 1.

## Da ricordare

Un guadagno aggregato può essere una regressione per i merchant piccoli. I pagamenti bloccati non hanno label. Prima della promozione si misura il paio modello-più-policy, per slice, non la curva sul validation set.

## Tema

La parte 3 ha scelto il punto sulla curva e ha mostrato che la media nasconde lo slice (gli ASN residenziali di Cloudflare). La parte 5 ha lasciato una «prova» sull’orologio lungo, senza dire che cosa la boccia. Questo pezzo è quella prova. È anche la chiusura della serie: il drift, detto con le parole di Stripe, si risponde con la cadenza di rilascio e con un cancello, non con un test statistico dal nome.

## Sezioni

### Meglio in aggregato, peggio per molti

Testo primario: la sezione di operations della guida Radar. Un modello migliore in media può far guadagnare pochi merchant grandi e far peggiorare molti merchant piccoli. Prima del rilascio misurano false positive rate, block rate e authorization rate, in aggregato e per merchant. Se il modello nuovo alza il block rate, per quel sottoinsieme si aggiusta, non si pubblica.

### La soglia del merchant è già in produzione

Quando esce una versione nuova, Stripe confronta le distribuzioni degli score. I merchant hanno già una soglia. Uno spostamento improvviso gli rompe la policy, anche se la curva è migliore. Legarlo alla parte 3 in una frase: il punto operativo non è tuo, è del merchant. Cambiare la distribuzione degli score significa spostargli il punto senza chiederglielo.

### I bloccati non hanno un esito

Dopo il rilascio si monitora il paio modello-più-policy. Sui pagamenti sotto soglia la dispute si osserva. Su quelli bloccati serve un controfattuale: che cosa sarebbe successo se fossero passati. Stripe dice di averci costruito dei metodi, e non li pubblica nel dettaglio. Fermarsi lì. Non inventare il metodo.

### Lo stesso controllo, a rollout già partito

Rileggere l’incidente Cloudflare della parte 3 come cancello, non come lezione sui falsi positivi. Il rollback sugli ASN residenziali è lo stesso controllo per slice che Stripe fa per merchant, applicato a un modello già in viaggio verso i datacenter. Non raccontare di nuovo il survey sul 33% e non rifare la curva.

### Il drift, come lo scrivono loro

Chiudere con la frase di Stripe: i trend di frode cambiano in fretta e il dato di training smette di rappresentare la frode di oggi. Il rimedio che pubblicano è la cadenza di rilascio, triplicata, e la dashboard di performance aggiornata prima ancora che il modello candidato esca. Un candidato già stantio su un sottoinsieme di traffico si riallena prima della promozione. È l’orologio lungo della parte 5, con sopra scritto il criterio.

## Figura

Un foglio solo, due righe di merchant, non un grafico.

Una riga «tutti»: la freccia del modello nuovo va verso l’alto. Sotto, tre righe corte (merchant grande, merchant piccolo, uno slice): due salgono, una scende, e accanto alla riga che scende c’è un riquadro «non promuovere». In un angolo, un mucchietto di pagamenti bloccati senza etichetta, con la scritta «esito sconosciuto». Matita, blu `#006cac` solo sul riquadro del cancello.

## Fonti

[1] Stripe, [«A primer on machine learning for fraud protection»](https://stripe.com/guides/primer-on-machine-learning-for-fraud-protection), sezione *Machine learning operations: deploying models safely and frequently*. Guida per clienti. Testo primario. Prendere le guardrail per merchant (false positive rate, block rate, authorization rate), il confronto delle distribuzioni degli score, il controfattuale sui pagamenti bloccati, la dashboard prima del rilascio, il mezzo punto di recall al mese e la triplicazione della cadenza solo se servono alla chiusura. Il mezzo punto è già il tema della parte 5: qui è il criterio, non la novità. Precision, recall e break-even sono la parte 3.

[2] Cloudflare, [«Monitoring machine learning models for bot detection»](https://blog.cloudflare.com/monitoring-machine-learning-models-for-bot-detection/). Post di engineering. Stesso incidente della parte 3. Prendere solo il gesto: slice, calo, rollback prima del resto dei datacenter. Non rispiegare perché un falso positivo costa.

## Non rifare

Non rifare la curva e il conto del pareggio. Non rifare i due orologi, se non per dire che la prova sull’orologio lungo ha un contenuto: lo slice, la distribuzione degli score, i bloccati senza label. È l’ultimo pezzo della serie: la chiusura può nominare la cascata, l’aggregato e l’IOC in tre frasi, senza riaprirli.
