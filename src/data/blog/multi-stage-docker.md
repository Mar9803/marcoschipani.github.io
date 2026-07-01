---
author: Marco Schipani
pubDatetime: 2026-06-15T10:00:00Z
title: "Multi-stage Docker?"
featured: false
draft: false
tags:
  - Docker
  - DevOps
description: "Notes on multi-stage Docker builds."
---

# 🐳 Guida Definitiva all'Asimmetria di Docker nella Data Science:

### Dall'Analisi dei Layer all'Ottimizzazione di Produzione

---

## 🧠 1. Introduzione & Ontologia del Dockerfile

Quando si approccia il mondo della **Data Science** e del **Machine Learning**, la tendenza naturale è quella di focalizzarsi esclusivamente sugli aspetti teorici e computazionali: gli algoritmi, l'algebra lineare o la convergenza dei pesi durante l'ottimizzazione di un modello. 

Tuttavia, nel contesto *enterprise*, un modello matematico eccezionale perde tutto il suo valore se non può essere distribuito in produzione in modo **efficiente, sicuro e scalabile**. 

Oggi smonteremo l'anatomia di un container Docker passo dopo passo, misurando l'impatto quantitativo e causale di ogni singola riga di codice. Da matematico e ammiratore di Musk-scienziato, la mia premessa nei momenti di discovery e studio rimane la stessa:

> Spacchettare i concetti più complessi e astrusi fino a ridurli ai loro principi primi, per poi farsi restituire un'immagine completa, non sgranata, arricchita di significato. Questo approccio di scomposizione analitica (AGGIUNGERE ARTICOLO citato da MR rip MR RIP))

Pertanto, partiamo dall’inizio. La prima domanda da porsi è di natura ontologica: cos'è, dal punto di vista strettamente informatico, un Dockerfile? 

A differenza di quanto si possa pensare, non si tratta di un semplice file di configurazione statico (come un file `.json` o `.yaml` deputato a descrivere lo stato statico o i parametri di un sistema già esistente). Un Dockerfile è a tutti gli effetti uno **script di automazione**, una **"ricetta di build" deterministica**. 

Mentre un file di configurazione standard si limita a stabilire come deve comportarsi un software preinstallato, il Dockerfile è una sequenza di istruzioni imperative che spiega a Docker come erigere da zero un intero micro-sistema operativo isolato e autonomo, cucito su misura attorno alla tua applicazione. Questo approccio sposa appieno la filosofia dell'**Infrastructure as Code (IaC)**.

> **IaC** :Invece di configurare un server o una macchina virtuale agendo manualmente — installando l'interprete Python, configurando i database e scaricando le librerie con il rischio intrinseco di dimenticare qualche dipendenza o introdurre asimmetrie ambientali —, l'intera infrastruttura viene codificata in un file di testo puro. 
>
> Il risultato logico è l'**invarianza**: chiunque esegua quel file in un qualunque istante temporale otterrà esattamente la stessa identica macchina computazionale.

---

## 2. Anatomia Quantitativa del Peso di un'Immagine

Prima di addentrarci nelle strategie di ottimizzazione vera e propria, è necessario comprendere quali siano le componenti strutturali di un'immagine Docker, così da isolare le singole variabili che contribuiscono al volume e al peso totale del pacchetto. 

Il peso complessivo di un'immagine Docker non è un blocco monolitico, bensì la somma dei pesi dei diversi **layer (livelli)** sovrapposti che la compongono. Se un'architettura progettata in modo ingenuo per un'applicazione Python o di Machine Learning può facilmente arrivare a pesare centinaia di megabyte (se non gigabyte), la scomposizione analitica di tale peso rivela la presenza di **4 macro-categorie strutturali**: 

1. **Il Sistema Operativo Base (La riga `FROM`):** Rappresenta lo strato software primordiale su cui poggia l'intera architettura. Se avviamo il Dockerfile con un'istruzione generica quale `FROM python:3.11`, stiamo caricando una distribuzione Debian completa.

> **Digressione: Debian**
> Debian è una distribuzione standard di Linux, famosissima per la sua stabilità nel mondo dei server cloud, ma intrinsecamente satura di utility, driver e pacchetti di sistema che durante il runtime della nostra applicazione non utilizzeremo mai. Questa base iniziale impone un "costo fisso" notevole, pesando circa **~800MB+**.

1. **Il Runtime del Linguaggio:** L'ambiente d'esecuzione e l'interprete Python vero e proprio, comprensivo di tutte le sue librerie standard di default.
2. **Le Dipendenze del Progetto (Pip packages):** Rappresenta la variabile più fluttuante del sistema. Mentre una micro-applicazione sviluppata in FastAPI dedicata a compiti di puro backend può pesare pochissimi megabyte, un ecosistema di Data Science o Deep Learning che richiede il caricamento di framework massivi come `torch` (PyTorch) o `tensorflow` vedrà il proprio peso esplodere istantaneamente di **1.5 GB o più**. Questo incremento esponenziale è dovuto alla presenza di enormi matrici matematiche pre-compilate e driver per il supporto dell'accelerazione hardware (GPU).
3. **I File di Supporto e i Compilatori di Sistema:** Strumenti e applicativi provvisori che risultano strettamente indispensabili solo nella finestra temporale dell'installazione delle librerie, ma che cessano di avere utilità a runtime.

Al contrario di queste pesanti macro-categorie, il codice sorgente Python puro che scriviamo per definire i nostri modelli o le nostre API ha un impatto volumetrico del tutto trascurabile, pesando quasi sempre meno di un singolo megabyte.


| Componente                     | Ruolo                                                                    | Peso Stimato (Ingenuo)                    |
| ------------------------------ | ------------------------------------------------------------------------ | ----------------------------------------- |
| 💿 **Sistema Operativo Base**  | La riga `FROM`: lo strato software primordiale                           | **~800MB+** (Se Debian standard)          |
| 🐍 **Runtime del Linguaggio**  | L'ambiente d'esecuzione e l'interprete Python con librerie standard      | Incluso nella base                        |
| 📦 **Dipendenze del Progetto** | I pacchetti installati via Pip (`pandas`, `torch`, `scikit-learn`, ecc.) | Da pochi MB a **1.5 GB+** (Deep Learning) |
| 🛠️ **File di Supporto**       | Strumenti e compilatori provvisori utili solo in fase di installazione   | Centinaia di MB                           |


---

## ⚖️ 3. Il Dilemma dei Compilatori Esteri nella Data Science

A questo punto abbiamo intuito un primo e immediato livello di ottimizzazione, proveniente dalla scelta ponderata dell'immagine di partenza. La prima regola fondamentale sancisce l'**assoluto divieto di ricorrere a immagini generiche** (es. `FROM python:3.11`), poiché l'inclusione di distribuzioni Debian complete introduce un rumore di fondo inaccettabile in un ambiente di produzione snello. 

Tuttavia, nel perimetro specifico della Data Science, la scelta dell'immagine sostitutiva nasconde un'insidia tecnica complessa legata ai compilatori di **sistema esterni**. Sebbene nel backend tradizionale si tenda a prediligere soluzioni ultra-leggere come Alpine Linux (un'immagine minimale di appena 50MB), scopriremo perché nel nostro settore il perfetto punto di equilibrio algoritmico sia rappresentato dall'immagine `python:3.11-slim`.

Una generica applicazione di Data Science esprime necessità infrastrutturali radicalmente diverse rispetto a un applicativo software standard. Tali necessità si traducono nell'utilizzo sistematico di costrutti e librerie matematiche avanzate come **NumPy, Pandas e Scikit-Learn**. Per poter eseguire calcoli tensoriali, matriciali e manipolazioni di vettori a velocità infinitesimale, il nucleo computazionale di queste librerie non è scritto in Python, bensì in **linguaggi compilati a basso livello come C, C++ o Fortran.** 

Qui emerge il problema cardine: *perché l'immagine Python si gonfia a dismisura durante la fase di build?* Quando impartiamo il comando `pip install`, il gestore dei pacchetti può andare incontro a due scenari binari: 

- 🟢 **Scenario A (I file "Wheel"):** Pip individua sul server remoto un pacchetto pre-compilato (chiamato appunto *wheel*) perfettamente compatibile con l'architettura hardware e la libreria di sistema ospite. In questo caso, si limita a scaricarlo e spacchettarlo senza alcuno sforzo computazionale aggiuntivo.
- 🔴 **Scenario B (Compilazione dal sorgente):** Se adottiamo un'immagine base ultra-leggera ma non standard come la sopracitata **Alpine Linux**, entriamo in un territorio ostile. Alpine non utilizza la libreria di sistema standard di Linux (`glibc`, usata da Debian e Ubuntu), bensì una variante minimale chiamata `musl`. Di conseguenza, i file pre-compilati wheel per Pandas o NumPy non esistono per Alpine. **Pip è costretto a scaricare i file sorgenti grezzi non compilati scritti in C/C++**.

Per poter convertire questo codice sorgente C in binari nativi capaci di interfacciarsi con Python, il sistema operativo ha bisogno di strumenti di compilazione esterni a Python, come `gcc`, `g++`, `make` (raggruppati sotto il metapacchetto Debian denominato `build-essential`). Questi compilatori di sistema si portano dietro un carico infrastrutturale che pesa **centinaia di megabyte**.

> ### 💡 La Soluzione di Compromesso:
>
> `python:3.11-slim` si rivela il compromesso ottimale. Con un peso di circa 100MB (leggermente superiore ai 50MB di Alpine), è interamente basata su una Debian ridotta all'osso. Questa scelta ci garantisce la piena compatibilità nativa con i pacchetti pre-compilati wheel delle librerie matematiche più importanti per il Machine Learning, azzerando i tempi di build ed evitandoci complessi problemi in fase di compilazione.
> Per eludere questo vicolo cieco, l'immagine `python:3.11-slim` si rivela il compromesso ottimale. Con un peso di circa 100MB (leggermente superiore ai 50MB di Alpine), è interamente basata su una **Debian ridotta all'osso**. Questa scelta ci garantisce la piena compatibilità nativa con i pacchetti pre-compilati wheel delle librerie matematiche più importanti per il Machine Learning, azzerando i tempi di build ed evitandoci complessi problemi in fase di compilazione.

---

## 🏗️ 4. L'Inefficienza dei Layer e la Soluzione: Il Multi-stage Build

L'analisi del meccanismo di installazione mette a nudo un'evidente **asimmetria temporale**: nel momento in cui compiliamo o installiamo una libreria complessa come Pandas, la presenza dei compilatori esterni e dei file temporanei è un requisito stringente; tuttavia, un secondo dopo il completamento dell'installazione, ciò che ci occorre per l'esecuzione del software è esclusivamente la libreria finale compilata, mentre tutto l'apparato sistemistico che è servito per generarla cessa di essere utile.

In un Dockerfile tradizionale, questo flusso genera una grave inefficienza strutturale:

> ### ⚠️ Inefficienza :
>
> I compilatori di sistema pesano centinaia di megabyte e, sebbene il loro utilizzo effettivo duri appena i 30 secondi della compilazione di Pip, essi rimangono incapsulati per sempre all'interno dell'immagine finale, occupando spazio inutile nei registri cloud e rallentando drammaticamente le operazioni di deployment in produzione. 

La filosofia per superare questo limite è netta e rigorosa: *ciò che serve per installare non coincide con ciò che serve per eseguire*. Per raggiungere la massima efficienza quantitativa, si implementa il paradigma del **Multi-stage Build**. L'idea cardine consiste nel suddividere l'orizzonte di build in due fasi logiche distinte e separate: una fase pesante di compilazione (**Builder**) e una successiva fase di esecuzione purificata (**Runner**). 

Assegnando nomi chiari e auto-esplicativi agli stage (`FROM ... AS builder` e `FROM ... AS runner`), possiamo strutturare il codice in modo che il primo stage si faccia carico di tutto lo "sporco" della compilazione, mentre il secondo raccolga solo i frutti del lavoro precedente.

Nella pratica, l'implementazione si presenta così:

```dockerfile
# ==========================================
# STAGE 1: Il Builder (Ambiente di compilazione pesante)
# ==========================================
FROM python:3.11-slim AS builder
WORKDIR /build

# Installiamo i compilatori necessari alla build di pacchetti C/C++
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Installiamo le dipendenze nella cartella utente /root/.local 
# Il flag --no-cache-dir distrugge i pacchetti compressi intermedi scaricati
RUN pip install --no-cache-dir --user -r requirements.txt

# ==========================================
# STAGE 2: Il Runner (Immagine finale snella di produzione)
# ==========================================
FROM python:3.11-slim AS runner
WORKDIR /app

# Il Trick MLOps: Copiamo SOLO le librerie compilate finite dallo stage precedente
COPY --from=builder /root/.local /root/.local
COPY ./src ./src

# Trick di sicurezza Enterprise: Abbandoniamo i privilegi di root in produzione
RUN adduser --disabled-password appuser
USER appuser

# Esplicitiamo il path di sistema per mappare i binari delle librerie copiate
ENV PATH=/root/.local/bin:$PATH

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0"]

```

Esaminando questo Dockerfile, dotiamo l'applicazione di un'ulteriore best practice fondamentale: l'adozione sistematica del flag `--no-cache-dir` durante l'esecuzione di Pip. Di default, Pip è programmato per salvare una copia speculare dei file compressi scaricati all'interno di una cartella di cache locale. In un ambiente isolato e immutabile come Docker, la persistence di questa cache post-installazione non ha alcuna utilità logica, e la sua rimozione coatta permette di risparmiare centinaia di megabyte di spazio residuo all'interno del layer.

Altrettanto cruciale è il posizionamento delle istruzioni `RUN adduser` e `USER appuser`. Di default, Docker esegue i processi con i massimi privilegi di sistema (`root`). In produzione questo è un risco di sicurezza inaccettabile: l'adozione di un utente non-root riduce la superficie d'attacco del container, impedendo che eventuali vulnerabilità del codice Python possano compromettere l'intera infrastruttura ospitante.

## 5. Il Trick del Layer Caching

Subito dopo aver compreso l'anatomia del Multi-stage Build, è necessario dominare il livello di ottimizzazione più sottile e potente a nostra disposizione: la gestione del Layer Caching abbinata all'utilizzo del file `.dockerignore`.

Spesso alcune scelte nella scrittura delle righe di un Dockerfile appaiono del tutto equivalenti o prive di conseguenze sistemiche. In realtà, l'ordine sequenziale con cui disponiamo i comandi è ciò che dà il boost finale alla riduzione fino a 10 volte dei tempi di rebuild del nostro container.

**Il problema della Cache:** Se modifichiamo una sola riga di codice nel nostro file `main.py`, un comando ingenuo come `COPY . /app` posizionato in cima al Dockerfile vedrà il suo hash modificato. La cache si rompe immediatamente a quel livello elevato della pila. Di conseguenza, tutti i layer successivi (compreso il pesante `RUN pip install`) verranno rieseguiti da zero. Saremo costretti a subire l'intera attesa del download e della ricompilazione di gigabyte di librerie scientifiche ad ogni minima variazione del codice sorgente.

Risolviamo il problema invertendo l'ordine dei fattori e introducendo la separazione delle aree

```Dockerfile

FROM python:3.11-slim

WORKDIR /app

# Step 1: Copiamo SOLO il manifesto delle dipendenze
COPY requirements.txt .

# Step 2: Installiamo le librerie (sfruttando il flag per non salvare file temporanei)
RUN pip install --no-cache-dir -r requirements.txt

# Step 3: Copiamo il codice sorgente (che cambia spesso)
COPY ./src ./src

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0"]

```

A questo impianto sequenziale dobbiamo tassativamente accostare la creazione di un file di esclusione posizionato nella root del progetto, denominato `.dockerignore`

```Plaintext
.venv
__pycache__/
.git
.idea

```

Questo accorgimento impedisce a Docker di copiare ciecamente all'interno dell'immagine l'ambiente virtuale locale (`.venv`), i file di cache temporanea di Python o i metadati generati automaticamente dagli IDE di sviluppo (come `.idea` di PyCharm). Grazie a questa asimmetria controllata, quando modificheremo il codice all'interno della cartella `/src`, Docker verificherà che il file `requirements.txt` è rimasto inalterato. Di conseguenza, riutilizzerà istantaneamente lo stato salvato in memoria per lo Step 1 e lo Step 2 (0 secondi!), applicando la reale riscrittura solo allo Step 3. La build si riduce a un battito di ciglia. 

## ⏱️ 6. Chiarimento: Quando e Come si Crea la Cache?

Per padroneggiare con rigore scientifico il Layer Caching, dobbiamo chiarire il funzionamento del motore deterministico di Docker rispondendo a un quesito fondamentale: *In quale preciso istante temporale viene riempita e memorizzata questa cache?*

La cache viene generata in modo integrale ed esclusivo durante la **primissima esecuzione assoluta del comando `docker build*`* sulla macchina di sviluppo. In questa prima istanza, Docker non possiede alcun punto di riferimento pregresso ed è obbligato a eseguire fisicamente e sequenzialmente ogni singola istruzione: 

- 🔍 Interroga l'hard disk locale.
- 🌐 Scarica i pacchetti di rete da internet.
- 🛠️ Compila i sorgenti a basso livello.
- 🧮 Calcola un valore identificativo univoco (un **hash crittografico**) per ciascun layer.

Al termine di questo processo, Docker archivia il risultato binario finale all'interno dei blocchi di memoria del disco fisso.

Nelle build successive a questa inizializzazione, Docker applica una **regola algoritmica ferrea**:

1. Analizza i comandi disposti nel Dockerfile rigorosamente **dall'alto verso il basso**.
2. Prima di procedere all'esecuzione reale di una riga, calcola l'hash dei file locali coinvolti in quel comando e lo confronta con lo storico della prima build.
3. Se l'impronta digitale coincide perfettamente e non rileva modifiche, Docker arresta l'esecuzione computazionale della riga e **riutilizza istantaneamente lo stato salvato sul disco** (comunicando a terminale il celebre messaggio `USING CACHE` a tempo zero).

> ### 🛑 L'Effetto Cascata dell'Invalidazione
>
> Nell'esatto momento in cui un singolo layer subisce una variazione (anche infinitesimale, come un commento rimosso nel codice sorgente), l'algoritmo rileva la discrepanza degli hash. 
>
> A quel punto, **la cache di quel livello viene istantaneamente invalidata e distrutta**. Per un principio di causalità sequenziale, Docker è costretto a rigenerare in modo reale tutti i comandi e i layer successivi, ripartendo dall'esecuzione fisica delle istruzioni e ignorando qualsiasi cache precedente.

Comprendere questa cascata logica e strutturare l'ordine delle righe di conseguenza è l'unico vero segreto per poter orchestrare pipeline di Continuous Integration (CI/CD) d'eccellenza nel panorama MLOps moderno.