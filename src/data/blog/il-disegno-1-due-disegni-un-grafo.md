---
author: Marco Schipani
pubDatetime: 2026-10-11T09:00:00Z
title: "Due disegni, un grafo"
description: "Due disegni dello stesso grafo possono incrociarsi in modi diversi. Kuratowski dice quando l'incrocio non dipende dal tratto."
featured: false
draft: false
series: il-disegno-non-e-il-grafo
seriesPart: 1
tags:
  - graph-theory
---

Cinque vertici, gli stessi archi, due fogli. Sul primo due curve si tagliano. Sposti un vertice e sul secondo il taglio non c’è più.

<figure style="margin: 2rem auto; text-align: center;">
  <img
    src="/marcoschipani.github.io/disegno-isomorfismo.gif"
    alt="Animazione: cinque vertici e gli stessi archi. Nel primo disegno due archi si incrociano, nel secondo l'incrocio è sparito."
    style="width: 100%; max-width: 820px; height: auto; border-radius: 6px; display: block; margin: 0 auto 0.75rem auto;"
  />
  <figcaption style="font-style: italic; font-size: 0.9rem; opacity: 0.7; max-width: 820px; margin: 0 auto;">
    <strong>Figura 1.</strong> Uno stesso grafo. Il conteggio degli incroci passa da 1 a 0 perché si spostano i vertici, non perché cambi un arco.
  </figcaption>
</figure>

<blockquote class="def">
<p>Un <strong>grafo</strong> è un insieme di vertici e un insieme di archi. Ogni arco è una coppia di vertici.</p>
</blockquote>

Un disegno mette i vertici nel piano e traccia gli archi come curve. Due disegni rappresentano lo stesso grafo quando esiste una corrispondenza biunivoca fra i vertici che conserva le adiacenze.

<blockquote class="def">
<p>Due disegni sono <strong>isomorfi</strong> quando quella corrispondenza esiste. Sono lo stesso grafo.</p>
</blockquote>

La figura 1 è un grafo solo. Il numero di incroci non è un <strong>invariante</strong>. Le animazioni di questo pezzo sono disegni fatti per la serie. La sequenza, due fogli poi $K_4$, $K_5$, $K_{3,3}$ e la suddivisione, segue il video di Tivadar Danka. [1]

### K₄ si scioglie

Quattro vertici, tutti e sei gli archi. È il grafo completo $K_4$. Nel quadrato le due diagonali si incrociano. Porta un vertice dentro il triangolo degli altri tre e l'incrocio sparisce.

<figure style="margin: 2rem auto; text-align: center;">
  <img
    src="/marcoschipani.github.io/disegno-k4.gif"
    alt="Animazione di K4: le diagonali del quadrato si incrociano, poi un vertice entra nel triangolo e l'incrocio sparisce."
    style="width: 100%; max-width: 820px; height: auto; border-radius: 6px; display: block; margin: 0 auto 0.75rem auto;"
  />
  <figcaption style="font-style: italic; font-size: 0.9rem; opacity: 0.7; max-width: 820px; margin: 0 auto;">
    <strong>Figura 2.</strong> $K_4$ è planare. Esiste un disegno senza incroci.
  </figcaption>
</figure>

<blockquote class="def">
<p>Un grafo è <strong>planare</strong> quando esiste un disegno nel piano in cui le curve degli archi si incontrano solo nei vertici comuni.</p>
</blockquote>

### K₅ no

Cinque vertici, tutti e dieci gli archi. È $K_5$. Puoi spostare i pallini quanto vuoi. Il contatore della figura non arriva a zero: si ferma a un incrocio.

<figure style="margin: 2rem auto; text-align: center;">
  <img
    src="/marcoschipani.github.io/disegno-k5.gif"
    alt="Animazione di K5: dal pentagono con molti incroci a un disegno con un solo incrocio, che non sparisce."
    style="width: 100%; max-width: 820px; height: auto; border-radius: 6px; display: block; margin: 0 auto 0.75rem auto;"
  />
  <figcaption style="font-style: italic; font-size: 0.9rem; opacity: 0.7; max-width: 820px; margin: 0 auto;">
    <strong>Figura 3.</strong> $K_5$. Quattro vertici si sistemano come un $K_4$ planare. Il quinto costringe un incrocio.
  </figcaption>
</figure>

Il conto che ti autorizza a smettere di cercare è corto. In un grafo piano semplice e connesso, con almeno tre vertici, ogni faccia ha almeno tre archi e ogni arco sta sul bordo di al massimo due facce, quindi $2e \ge 3f$. La formula di Eulero, faccia esterna compresa, è

$$
v - e + f = 2.
$$

Da lì $f = e - v + 2$. Sostituisci e ottieni $e \le 3v - 6$.

<figure style="margin: 2rem auto; text-align: center;">
  <img
    src="/marcoschipani.github.io/disegno-euler.png"
    alt="Un quadrato con una diagonale: due facce interne e la faccia esterna. Sotto, v uguale 4, e uguale 5, f uguale 3, e 4 meno 5 più 3 uguale 2."
    style="width: 100%; max-width: 820px; height: auto; border-radius: 6px; display: block; margin: 0 auto 0.75rem auto;"
  />
  <figcaption style="font-style: italic; font-size: 0.9rem; opacity: 0.7; max-width: 820px; margin: 0 auto;">
    <strong>Figura 4.</strong> Un disegno planare piccolo. Due facce interne, più la faccia esterna. Il conto torna a 2.
  </figcaption>
</figure>

$K_5$ ha $v = 5$ e $e = 10$. La soglia è $3 \cdot 5 - 6 = 9$. Dieci archi non ci stanno. Se la disuguaglianza fallisce, un disegno senza incroci non esiste. Se la disuguaglianza tiene, non hai ancora concluso: il grafo può essere non planare lo stesso.

### K₃,₃, e perché il conto di prima tace

Due parti da tre vertici. Ogni vertice di una parte è unito a tutti e tre dell'altra, e a nessuno della propria. Nove archi, sei vertici. È il grafo completo bipartito $K_{3,3}$, quello delle tre case e dei tre pozzi.

$3v - 6 = 12$, e $9 \le 12$. Il conto che ha chiuso $K_5$ qui non dice nulla.

$K_{3,3}$ è bipartito: ogni ciclo è pari. In un disegno planare di un grafo bipartito semplice ogni faccia ha almeno quattro archi, quindi $2e \ge 4f$. Con Eulero si ottiene $e \le 2v - 4$. Qui la soglia è $2 \cdot 6 - 4 = 8$, e gli archi sono 9. Il disegno della figura si ferma a un incrocio perché quello è il minimo, non perché il layout sia ancora grezzo.

<figure style="margin: 2rem auto; text-align: center;">
  <img
    src="/marcoschipani.github.io/disegno-k33.gif"
    alt="Animazione di K3,3: due parti di tre vertici, colorate in modo diverso, tutti e nove gli archi. Il contatore scende e si ferma a un incrocio."
    style="width: 100%; max-width: 820px; height: auto; border-radius: 6px; display: block; margin: 0 auto 0.75rem auto;"
  />
  <figcaption style="font-style: italic; font-size: 0.9rem; opacity: 0.7; max-width: 820px; margin: 0 auto;">
    <strong>Figura 5.</strong> $K_{3,3}$. I vertici teal e quelli ambra sono le due parti. Resta un incrocio.
  </figcaption>
</figure>

### Quello che garantisce Kuratowski

<blockquote class="def">
<p>Una <strong>suddivisione</strong> si ottiene sostituendo archi con cammini. I vertici interni di quei cammini hanno grado 2: sono vertici nuovi, non rami nuovi.</p>
</blockquote>

<blockquote class="def">
<p>Teorema di <strong>Kuratowski</strong>. Un grafo finito è planare se e solo se non contiene, come sottografo, una suddivisione di $K_5$ né una suddivisione di $K_{3,3}$.</p>
</blockquote>

La garanzia è doppia, ed è tutta lì.

Se esibisci una di quelle suddivisioni, ogni disegno nel piano del grafo intero ha almeno un incrocio lungo quei cammini. Il <strong>certificato</strong> è il sottografo. Lo puoi controllare: le due parti, i cammini che le congiungono tutte, i vertici di grado 2 in mezzo.

Se nessuna delle due suddivisioni c'è, un disegno senza incroci esiste. L'incrocio della figura 1 era di quel tipo: si toglie spostando i vertici, e il grafo non cambia.

I vertici di grado 2 sono il motivo per cui il teorema parla di suddivisioni, e non solo dei due grafi nudi. Un vertice infilato a metà di un arco non scioglie l'ostruzione.

<figure style="margin: 2rem auto; text-align: center;">
  <img
    src="/marcoschipani.github.io/disegno-suddivisione.gif"
    alt="Animazione: su un arco di K3,3 compare un vertice di grado 2. L'incrocio resta uno."
    style="width: 100%; max-width: 820px; height: auto; border-radius: 6px; display: block; margin: 0 auto 0.75rem auto;"
  />
  <figcaption style="font-style: italic; font-size: 0.9rem; opacity: 0.7; max-width: 820px; margin: 0 auto;">
    <strong>Figura 6.</strong> Il vertice $m$ ha grado 2. È una suddivisione di $K_{3,3}$. L'incrocio resta.
  </figcaption>
</figure>

Boyer e Myrvold estraggono una suddivisione di questo tipo in tempo lineare nella taglia del grafo: o il grafo è planare, o il test restituisce un certificato. [2]

Nella <strong>tesi triennale</strong> l'oggetto era questo: la planarità, il teorema, e l'estrazione del sottografo che fa da certificato.

Una stella si disegna senza incroci. Un ciclo si disegna senza incroci. Una suddivisione di $K_{3,3}$ no. In un grafo di pagamenti i primi due sono figure che un analista riconosce. La terza è il punto in cui la figura è costretta a incrociarsi. La parte 2 sta su quella figura. Il teorema non marca un pagamento come frode.

### Fonti

[1] Tivadar Danka, [«Graph Theory for Visual Learners»](https://www.youtube.com/watch?v=meGET4i3QMc), YouTube, 6 ottobre 2026. Il testo che accompagna il video è su [The Palindrome](https://thepalindrome.org/p/graph-theory-for-visual-learners). Ci ho preso l’ordine delle figure: due disegni dello stesso grafo, $K_4$ che si scioglie, $K_5$ e $K_{3,3}$ che no, la suddivisione. I disegni di questa pagina sono fatti per il pezzo, non sono fotogrammi del video.

[2] John M. Boyer, Wendy J. Myrvold, [«On the Cutting Edge: Simplified O(n) Planarity by Edge Addition»](https://jgaa.info/index.php/jgaa/article/view/paper91), Journal of Graph Algorithms and Applications, 8(3), 2004. Ci ho preso il fatto che il test lineare restituisce un disegno planare oppure una suddivisione di Kuratowski. Il teorema, la disuguaglianza $e \le 3v-6$ e il vincolo bipartito $e \le 2v-4$ sono svolti nel testo.
