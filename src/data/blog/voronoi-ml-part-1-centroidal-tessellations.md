---
author: Marco Schipani
pubDatetime: 2026-07-13T10:00:00Z
title: "[Voronoi Diagrams teaching ML] Part 1: Centroidal Voronoi Tessellations"
description: "The mathematical evolution of a millennia-old problem — Voronoi cell formalism, Gersho's conjecture, and the limits of dimensionality."
featured: false
draft: false
series: voronoi-diagrams-ml
seriesPart: 1
tags:
  - computational geometry
  - machine-learning
  - mathematics
---

<figure style="margin: 2rem auto; text-align: center;">
  <a href="/marcoschipani.github.io/Voronoi_Metro_Paris.png" target="_blank" rel="noopener noreferrer">
    <img
      src="/marcoschipani.github.io/Voronoi_Metro_Paris.png"
      alt="Metro map of Paris"
      style="width: 100%; max-width: 1000px; height: auto; border-radius: 8px; border: 2px solid #555; display: block; margin: 0 auto 0.75rem auto;"
    />
  </a>
  <figcaption style="font-style: italic; font-size: 0.9rem; opacity: 0.7; max-width: 1000px; margin: 0 auto;">Paris Metro, stations as generator seeds for each Voronoi cell.</figcaption>
</figure>

## Où se trouve la prochaine station ?


Se vi fermate a osservare un nido d’ape, la prima cosa che salta all’occhio è la sua straordinaria regolarità geometrica. Le api costruiscono cellette esagonali perfette. Ma vi siete mai chiesti perché? Non si tratta di un semplice capriccio estetico della natura, ma di una risposta a un problema di ottimizzazione geometrica che ha impiegato più di duemila anni per essere dimostrato matematicamente.
In questo post vi guiderò in un viaggio affascinante che parte dall'antica Grecia, passa per la formulazione variazionale moderna e arriva agli algoritmi avanzati di geometria computazionale che usiamo oggi per risolvere problemi complessi.

### 1. La congettura del nido d’ape: un excursus storico dall'antichità a Hales

La storia di questo problema ha radici profonde e affascinanti che si perdono nel tempo. Tutto ha inizio nel **36 a.C.**, quando l'erudito romano **Marco Terenzio Varrone**, nel suo trattato sull'agricoltura (*De Re Rustica*), mise per iscritto le prime riflessioni sulla forma esagonale del nido d'ape. 

In quell'epoca coesistevano principalmente due teorie rivali per spiegare questa geometria:
1. Una teoria biologico-funzionale, secondo la quale l'esagono si adattava meglio alla fisionomia della vespa o dell'ape (in particolare per accogliere le sue sei zampe).
2. Una teoria puramente matematica, sostenuta dai geometri dell'epoca, che spiegava la struttura attraverso una proprietà isoperimetrica.

Varrone descriveva così questa disputa:

> "Does the chambers in the comb has six angles [...] the geometricians prove that this hexagon inscribed in a circular figure encloses the greatest amount of space."

Questa intuizione si ricollegava direttamente ai celebri problemi isoperimetrici studiati secoli prima dai Pitagorici. Era infatti noto fin dai tempi di Pitagora che solo tre poligoni regolari sono in grado di tassellare il piano (ossia ricoprirlo completamente senza lasciare vuoti o sovrapposizioni): il triangolo equilatero, il quadrato e l'esagono.

<div style="margin: 2.25rem auto; max-width: 400px; padding: 0 1rem; text-align: center;">
  <a href="/marcoschipani.github.io/honeycomb_art.png" target="_blank" rel="noopener noreferrer">
    <img src="/marcoschipani.github.io/honeycomb_art.png" alt="Hexagonal honeycomb tessellation" style="width: 100%; height: auto; border-radius: 8px; border: 1px solid color-mix(in srgb, var(--border) 80%, transparent); box-shadow: 0 8px 32px color-mix(in srgb, var(--foreground) 6%, transparent); display: block;" />
  </a>
</div>

Circa due secoli dopo Varrone, il matematico **Pappo di Alessandria** affrontò formalmente il problema nel **quinto libro** della sua *Collezione Matematica*. Pappo seguì l'approccio ancora più antico di **Zenodoro** (circa 180 a.C.) e utilizzò la tassellazione regolare per attribuire alle api una straordinaria "intuizione geometrica" nella scelta dell'esagono rispetto al triangolo o al quadrato, essendo il poligono che ottimizza il rapporto perimetro/area. 

Tuttavia, le motivazioni di Pappo per escludere altre configurazioni non erano puramente matematiche. Egli riteneva fondamentale l'assenza di spazi vuoti tra le celle per motivi igienici:

> "...foreign matter could enter in the interstices between them and so defile the purity of their produce."

Nonostante questa apparente "evidenza naturale", il problema è rimasto per secoli una semplice congettura indimostrata. Nessuno è riuscito a trasformarlo in un teorema rigoroso fino al **1999**, quando il matematico **Thomas Hales** ha pubblicato una dimostrazione completa e formale per il caso bidimensionale (2D). Ad oggi, la congettura per dimensioni superiori rimane ancora uno dei grandi problemi aperti della matematica.

---

### 2. Dalla natura alla geometria convessa: il formalismo di Voronoi e la congettura di Gersho

La congettura del nido d'ape ci mostra come la natura sia un'ottimizzatrice spietata. Ma per trasformare questa osservazione in un teorema, i matematici hanno dovuto costruire un intero apparato geometrico. 

Nel 1999, lo stesso anno in cui Thomas Hales dimostrava la congettura classica, il matematico **Peter M. Gruber** ha fornito una straordinaria e raffinata dimostrazione nel caso bidimensionale (2D), basandosi sugli strumenti della **geometria convessa** e della teoria dell'approssimazione poliedrica. 

Per capire come Gruber e gli altri matematici abbiano affrontato il problema, dobbiamo prima comprendere il formalismo che sta dietro alla struttura geometrica regina di questo ambito: il **Diagramma di Voronoi**.

---

#### L'anatomia geometrica di una cella: come si traccia un confine?

Immaginiamo di avere un insieme di $n$ punti distinti nel piano (o in uno spazio a più dimensioni), che chiameremo **siti**:

$$P = \{p_1, p_2, \dots, p_n\}$$

Un diagramma di Voronoi risponde a una domanda semplicissima: *"Quali sono i punti del piano più vicini a ciascun sito?"*. 

Formalmente, definiamo la **cella di Voronoi** $V(p_i)$ associata al sito $p_i$ come l'insieme di tutti i punti $q$ del piano la cui distanza $d(p_i, q)$ è strettamente minore rispetto a quella da qualsiasi altro sito $p_j$ (con $j \neq i$):

$$V(p_i) = \{q \mid d(p_i, q) < d(p_j, q), \forall j \neq i\}$$

<div style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; align-items: flex-end; margin: 2rem auto; max-width: 1000px;">
  <figure style="flex: 1 1 300px; margin: 0; text-align: center;">
    <a href="/marcoschipani.github.io/Vor2D.png" target="_blank" rel="noopener noreferrer" style="display: block; height: 260px;">
      <img src="/marcoschipani.github.io/Vor2D.png" alt="Voronoi diagram in 2D" style="width: 100%; max-width: 420px; height: 260px; object-fit: contain; border-radius: 6px; display: block; margin: 0 auto 0.75rem auto;" />
    </a>
    <figcaption style="font-style: italic; font-size: 0.85rem; opacity: 0.7;">2D Voronoi tessellation</figcaption>
  </figure>
  <figure style="flex: 1 1 300px; margin: 0; text-align: center;">
    <a href="/marcoschipani.github.io/voronoi_3d.png" target="_blank" rel="noopener noreferrer" style="display: block; height: 260px;">
      <img src="/marcoschipani.github.io/voronoi_3d.png" alt="Voronoi diagram in 3D" style="width: 100%; max-width: 420px; height: 260px; object-fit: contain; border-radius: 6px; display: block; margin: 0 auto 0.75rem auto;" />
    </a>
    <figcaption style="font-style: italic; font-size: 0.85rem; opacity: 0.7;">3D Voronoi tessellation</figcaption>
  </figure>
</div>

##### Una costruzione visiva: l'intersezione dei semipiani
C'è un modo molto elegante e geometricamente intuitivo per visualizzare come si forma questa cella. 

Prendiamo due soli siti, $p_i$ e $p_j$. Se tracciamo il segmento che li unisce, il loro **bisettore** $B(p_i, p_j)$ è semplicemente l'asse di questo segmento (la retta perpendicolare che passa per il punto medio):

$$B(p_i, p_j) = \{x \mid d(p_i, x) = d(p_j, x)\}$$

Questo asse funziona come un confine politico: divide il piano esattamente in due **semipiani aperti**. Chiamiamo $h(p_i, p_j)$ la metà del piano che contiene il punto $p_i$. Un punto si trova in questa metà se e solo se è più vicino a $p_i$ rispetto a $p_j$.

Se ripetiamo questo gioco per tutti gli altri siti presenti, la cella di Voronoi finale di $p_i$ non sarà altro che lo spazio in cui **tutti** questi semipiani favorevoli a $p_i$ si sovrappongono. In termini matematici, la cella è l'intersezione di questi semipiani:

$$V(p_i) = \bigcap_{j \neq i} h(p_i, p_j)$$

Poiché l'intersezione di semipiani (che sono insiemi convessi) genera sempre una figura convessa, ne consegue una proprietà fondamentale: **ogni cella di Voronoi è un poligono convesso** (che può essere limitato o estendersi all'infinito verso i bordi del diagramma).

Quando queste celle si incontrano, danno vita alla struttura del diagramma:
* **I segmenti di confine** (dove i punti sono equidistanti da esattamente due siti) sono chiamati *Voronoi edges* (spigoli).
* **I punti di intersezione** di questi segmenti (dove convergono tre o più celle) sono i *Voronoi vertices* (vertici).

---

#### 2.2 Dalle mappe della metropolitana ai segreti della natura selvaggia

Se l'intersezione di semipiani vi sembra una speculazione puramente accademica, sappiate che questa struttura geometrica descrive in modo straordinariamente preciso molti aspetti del mondo reale, sia antropici che biologici. 

##### Il caso urbano: La rete metropolitana di Parigi
Pensate alla mappa di una metropoli come Parigi. Se posizioniamo un punto su ogni stazione della metropolitana (i nostri *siti* $p_i$) e tracciamo il diagramma di Voronoi associato, otteniamo una mappa funzionale utilissima. Ogni cella risultante rappresenta il "bacino d'utenza" ideale di quella specifica stazione: se vi trovate all'interno di una determinata cella, la stazione al suo centro è matematicamente la più vicina a voi. 

I confini di queste celle sono i punti in cui è geograficamente indifferente camminare verso una stazione o verso quella adiacente. Questo tipo di tassellazione spaziale viene usato quotidianamente dai pianificatori urbani per ottimizzare la copertura dei servizi pubblici, dei presidi sanitari o delle reti logistiche.

##### L'impronta di Voronoi nella natura selvaggia
Ma l'uomo non ha fatto altro che copiare la natura. Al di fuori del nido d'ape, i diagrammi di Voronoi appaiono spontaneamente ovunque vi siano processi di crescita simultanea o di scarico delle tensioni fisiche:

* **Il manto delle giraffe:** Le celebri chiazze scure sul corpo di una giraffa si formano durante lo sviluppo embrionale a partire da centri di pigmentazione melaninica (i siti). La melanina si diffonde radialmente da ciascun centro fino a quando non incontra il fronte chimico della cella adiacente, arrestandosi e disegnando un perfetto diagramma di Voronoi biologico.
* **Le ali delle libellule e le venature delle foglie:** La complessa rete strutturale che sostiene le ali degli insetti o che trasporta i nutrienti nelle foglie è ottimizzata per garantire la massima resistenza con il minor dispendio di materiale biologico, ricalcando le geometrie di Voronoi.
* **Il fango essiccato e le rocce basaltiche:** Quando il terreno argilloso si asciuga sotto il sole, si contrae. La tensione si distribuisce nello spazio e si scarica creando crepe che si diramano radialmente da punti di debolezza, stabilizzandosi in poligoni convessi. Lo stesso monumentale processo ha dato vita alle celebri colonne basaltiche del *Giant's Causeway* in Irlanda.

---

#### Il punto di perfetto equilibrio: le Tassellazioni Centroidali e una congettura "cristallina"

Ora facciamo un passo avanti. In un diagramma di Voronoi standard, i siti generatori possono trovarsi in qualunque punto all'interno delle loro celle. Ma cosa succede se imponiamo una condizione di perfetto equilibrio?

Chiediamo che ogni sito $p_i$ coincida esattamente con il **baricentro** (il centro geometrico o centroide) della propria cella $V(p_i)$. Quando questo accade, la struttura prende il nome di **Tassellazione di Voronoi Centroidale (CVT)**.

Le CVT godono di una straordinaria proprietà variazionale: minimizzano una forma di energia non locale, nota come **energia del secondo momento** (o energia di distorsione):

$$E(Y) := \int_{Q} \text{dist}^2(x, Y) \, dx$$

Questa energia misura, in parole povere, quanto i punti di una regione siano mediamente "distanti" dal loro centroide di riferimento. Minimizzarla significa trovare la ripartizione dello spazio più efficiente e bilanciata possibile.

Qui entra in gioco la celebre **congettura di Gersho (1979)**, che riformula il problema del nido d'ape sotto l'ipotesi di convessità:

> **La Congettura di Gersho (in sintesi):**
> All'aumentare del numero di punti ($n \to +\infty$), le celle di una CVT a minima energia tendono a diventare tutte geometricamente identiche (congruenti) a una singola cella base (un politopo fondamentale $V$) che dipende esclusivamente dalla dimensione dello spazio.

---

#### 2.4 Il balzo in 3D: La maledizione della dimensionalità e la sfida dei cristalli

Come succede spessissimo in matematica, quando si affronta un problema che "vive bene" – ossia nasce in modo naturale in una specifica dimensionalità (nel caso dell'Honeycomb il problema nasce in 2D, proprio perché ispirato da un fenomeno biologico intrinsecamente bidimensionale come il nido d'api) – e si tenta di generalizzarlo a dimensioni superiori per soddisfare lo stimolo fondamentale della disciplina, ci si scontra inevitabilmente con la cosiddetta **"maledizione della dimensionalità"** (*curse of dimensionality*).

Tutta la storia della matematica è costellata di esempi celebri in cui un teorema apparentemente semplice e lineare nel piano si trasforma in un mostro di complessità non appena si sale di una sola dimensione. La congettura di Gersho non fa eccezione.

Per capire questa complessità dal punto di vista geometrico e fisico, immaginiamo di pensare come dei **cristallografi**:

* **In due dimensioni (2D):** Il sistema cristallizza in un **reticolo triangolare**. Se posizioniamo i siti sui nodi di questo reticolo, le celle di Voronoi risultanti che rivestono lo spazio sono **esagoni regolari perfetti**. È la configurazione a minor energia, quella scelta dalle api. Peter M. Gruber è riuscito a dimostrare rigorosamente questa intuizione del piano sfruttando un elegante espediente matematico basato sull'**approssimazione poliedrica**: ha studiato cioè come approssimare corpi convessi lisci tramite poliedri con un numero controllato di facce, legando l'errore di approssimazione asintotico direttamente all'energia di distorsione delle celle.

* **In tre dimensioni (3D):** Qui le cose si complicano drasticamente. Non esistono poliedri regolari capaci di tassellare lo spazio tridimensionale perfetto. A priori, il numero di facce dei poliedri di Voronoi associati ai punti critici potrebbe crescere a dismisura all'aumentare dei punti $n$. Su questo fronte, i matematici **Rustum e Choksi** hanno fatto un passo avanti fondamentale dimostrando l'esistenza di limiti superiori (*upper bounds*) sulla complessità geometrica (incluso il numero massimo di facce) di tali poligoni, limiti che rimangono indipendenti da $n$. 

Nonostante questo risultato sembrasse spianare la strada all'estensione di Gersho in 3D, gli stessi Rustum e Choksi hanno evidenziato una profonda differenza strutturale tra le due dimensioni: in 3D **non ci si aspetta la presenza di una configurazione universalmente ottimale**. Questo è in netto contrasto con il 2D, dove il reticolo triangolare è quasi certamente l'ottimo universale.

Questo strano fenomeno non è nuovo alla fisica matematica. Basti pensare al problema delle schiume ottimali (il *famoso problema di Kelvin*): se in 2D la struttura a nido d'ape (con i baricentri sul reticolo triangolare) è l'ottimo indiscusso, in 3D la classica struttura proposta da Lord Kelvin (il reticolo cubico bitroncato, a sinistra nell'immagine sotto) si è rivelata non ottimale, superata nel 1993 dall'incredibile ed efficiente **struttura di Weaire-Phelan** (a destra).

<figure style="margin: 2rem auto; text-align: center;">
  <a href="/marcoschipani.github.io/troncato3D.png" target="_blank" rel="noopener noreferrer">
    <img src="/marcoschipani.github.io/troncato3D.png" alt="Confronto tra la struttura di Kelvin e la struttura di Weaire-Phelan" style="width: 100%; max-width: 900px; height: auto; border-radius: 6px; display: block; margin: 0 auto 0.75rem auto;" />
  </a>
  <figcaption style="font-style: italic; font-size: 0.9rem; opacity: 0.7; max-width: 900px; margin: 0 auto;">Comparison of space-filling structures: Kelvin’s bitruncated cubic lattice (left) versus the more energetically efficient Weaire-Phelan structure (right).</figcaption>
</figure>

Ad oggi, la congettura di Gersho in 3D **rimane ufficialmente aperta**. I matematici **Barnes e Sloan** hanno dimostrato con rigore l'ottimalità della configurazione BCC (cubica a corpo centrato, che genera celle a forma di ottaedro troncato) limitatamente alla classe delle sole configurazioni a reticolo (*lattice*), mentre **Du e Wang** hanno fornito forti evidenze numeriche a supporto della congettura globale. 

La natura non locale e fortemente non convessa dell'energia di distorsione assicura un panorama energetico tormentato, denso di minimi locali e configurazioni quasi-ottimali dalle geometrie incredibilmente complesse, rendendo la ricerca del minimo globale assoluto uno dei territori di frontiera più affascinanti della geometria computazionale contemporanea.

