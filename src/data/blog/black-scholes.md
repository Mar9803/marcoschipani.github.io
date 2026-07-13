---
author: Marco Schipani
pubDatetime: 2026-07-10T10:00:00Z
title: "Black-Scholes"
featured: false
draft: false
tags:
  - mathematics
  - quantitative finance
  - stochastic calculus
description: "Notes on the Black-Scholes model for European option pricing — from the SDE of geometric Brownian motion to the closed-form call and put formulas."
---

# Dall'Algebra Lineare a Wall Street: Risolvere Black-Scholes con la Decomposizione LU e Crank-Nicolson

## 1. Introduzione e Motivazione

### Il Gancio Storico-Scientifico

La moderna teoria del *pricing* dei derivati finanziari affonda le sue radici nel 1973, anno in cui gli economisti Fischer Black e Myron Scholes pubblicarono il loro seminale saggio *"The Pricing of Options and Corporate Liabilities"*. Attraverso un elegante impianto macroeconomico — basato sull'assenza di arbitraggio e sulla replica continua di un portafoglio privo di rischio — gli autori (insieme al contributo indipendente di Robert Merton) formalizzarono una celebre Equazione Differenziale alle Derivate Parziali (EDP) parabolica. L'impatto di tale framework fu talmente dirompente da ridefinire l'assetto dei mercati globali, valendo a Scholes e Merton il Premio Nobel per l'Economia nel 1997 (Black era scomparso nel 1995).

### Il Problema: Limiti delle Soluzioni Analitiche

Nella finanza quantitativa classica, un'opzione finanziaria è un contratto derivato il cui valore dipende rigidamente dalle fluttuazioni di un asset sottostante (ad esempio, un'azione). Nella sua forma più lineare, un'opzione *Call Europea* conferisce al compratore il diritto, ma non l'obbligo, di acquistare il sottostante a un prezzo prefissato (*Strike*, $E$) esclusivamente alla data di scadenza $T$. Al contrario, un'opzione *Put* conferisce il diritto di vendita. 

Sebbene per le opzioni europee standard esista una formula analitica esatta in forma chiusa (la celebre formula di Black-Scholes), la letteratura finanziaria ha ampiamente dimostrato che le soluzioni analitiche falliscono non appena ci si allontana dalle condizioni ideali di mercato. Quando i parametri chiave come la volatilità ($\sigma$) o il tasso di interesse ($r$) non sono costanti ma variano in funzione del tempo o dello spazio (volatilità locale/stocastica), o quando lo strumento presenta clausole di esercizio anticipato, l'integrazione analitica diretta diventa matematicamente impossibile. 

### Il Trade-Off Numerico in Letteratura

Per ovviare all'assenza di formule chiuse, la letteratura propone tre principali macro-approcci, ciascuno caratterizzato da specifici compromessi computazionali:

1. **Metodi Monte Carlo:** Estremamente flessibili e adatti a opzioni multi-asset (alta dimensionalità), ma affetti da una convergenza molto lenta ($O(1/\sqrt{M})$), che li rende costosi in termini di tempo di calcolo.
2. **Modelli Albero (Binomiali/Trinomiali):** Intuitivi e facili da implementare per opzioni con esercizio anticipato, ma configurabili come approssimazioni meno precise rispetto a griglie continue.
3. **Metodi alle Differenze Finite (FDM):** Ideali per problemi monodimensionali o bidimensionali (come il pricing di una singola opzione vanilla o barriera). Garantiscono un'elevata precisione locale ed efficienza, a patto di saper gestire la stabilità numerica del passo temporale.

I problemi di instabilità legati agli schemi puramente espliciti (vincolo CFL) vengono storicamente superati in letteratura adottando schemi impliciti o semi-impliciti.

### Obiettivo dell'Articolo: L'Efficienza dei Sistemi Tridiagonali

L'obiettivo di questo articolo è dimostrare come il metodo alle differenze finite di **Crank-Nicolson** permetta di trasformare la complessa EDP continua di Black-Scholes in una successione di **sistemi lineari algebrici** ad ogni passo temporale. La peculiarità matematica di questo approccio risiede nella struttura delle matrici generate: si tratta di **matrici tridiagonali**, ovvero matrici in cui gli unici elementi diversi da zero si trovano sulla diagonale principale, sulla superdiagonale e sulla sottodiagonale. 

In algebra lineare numerica, un sistema tridiagonale gode di vantaggi computazionali straordinari: può essere risolto con una complessità computazionale pari a $O(M)$ anziché l' $O(M^3)$ di una matrice densa generica. Questo riduce drasticamente l'onere computazionale, consentendo simulazioni ad altissima precisione in frazioni di secondo.

---



## 2. Il Modello Finanziario e l'EDP

Prendiamo come riferimento un'opzione **Call Europea** scritta su un'azione che non paga dividendi. 

> **Nota Finanziaria: Call Europee vs Call Americane**  
> Mentre l'opzione *Europea* può essere esercitata dal possessore esclusivamente nel giorno esatto della scadenza $T$, l'opzione *Americana* offre la flessibilità di essere esercitata in **qualsiasi momento** antecedente o pari a $T$. Dal punto di vista matematico, ciò trasforma il problema di Black-Scholes per le opzioni americane in un problema di frontiera libera (disuguaglianza variazionale), richiedendo un controllo aggiuntivo ad ogni step per verificare se l'esercizio anticipato sia più conveniente del valore di continuazione dell'opzione.

L'evoluzione del prezzo dell'opzione $V(S,t)$ è governata dalla seguente equazione differenziale alle derivate parziali:
$$\frac{\partial V}{\partial t}+\frac{1}{2}\sigma^{2}S^{2}\frac{\partial^{2}V}{\partial S^{2}}+rS\frac{\partial V}{\partial S}-rV=0$$

### Un Esempio Realistico

Per dare concretezza fisica alle variabili matematiche, immaginiamo uno scenario reale:

- $S$: Prezzo attuale dell'azione sottostante (es. 20).
- $E$: Prezzo di esercizio o *Strike* (es. 22).
- $\sigma$: Volatilità dell'azione (es. $15$), che misura l'intensità delle fluttuazioni del prezzo.
- $r$: Tasso di interesse privo di rischio (es. $7$), solitamente associato ai titoli di stato a breve termine.
- $T$: Tempo alla scadenza (es. $9$ mesi, ovvero $0.75$ anni).



### Condizioni al Contorno (Boundary Conditions)

Per isolare un'unica soluzione della EDP, è fondamentale imporre le condizioni iniziali (che nel calcolo finanziario agiscono a ritroso a partire dal tempo finale di scadenza $t=T$) e le condizioni ai limiti dello spazio $S$:

1. **Condizione Terminale (Payoff a scadenza):** A $t=T$, il valore della Call è deterministicamente noto. Integrando il nostro esempio: se l'azione scade a 25, l'opzione vale $25 - 22 = 3$. Se scade a 18, non viene esercitata e vale 0. In formule:
  $$V(S,T) = \max(S - E, 0) = \max(S - 22, 0)$$
2. **Condizione Inferiore ($S=0$):** Se il prezzo dell'azione crolla a zero, la probabilità che risalga sopra lo strike di 22 è nulla. L'opzione non avrà mai valore:
  $$V(0,t) = 0, \quad \forall t \ge 0$$
3. **Condizione Superiore ($S \rightarrow \infty$):** Se il prezzo del sottostante cresce a dismisura, l'esercizio della Call è virtualmente certo. Il valore attuale dello Strike da pagare alla scadenza viene scontato al tasso risk-free $r$:
  $$V(S,t) \sim S - E e^{-r(T-t)} = S - 22 e^{-0.07(0.75-t)}$$

---



## 3. La Transizione da EDP a Sistema Lineare

Per risolvere numericamente l'equazione, lo spazio continuo $(S,t)$ viene discretizzato posizionando dei nodi equispaziati su una griglia rettangolare. Definiamo il passo temporale $h = \frac{T}{N}$ e il passo spaziale $k = \frac{S_{max}}{M}$. Il valore approssimato dell'opzione nel nodo generico sarà identificato come $V_i^j$, dove l'indice $i$ rappresenta lo step spaziale del prezzo e $j$ lo step temporale.

Il metodo di **Crank-Nicolson** opera approssimando la derivata temporale con un rapporto differenziale finito, mentre le derivate spaziali vengono calcolate come la media aritmetica tra il passo temporale corrente $j$ e il passo successivo $j+1$. Questo bilanciamento conferisce al metodo la sua caratteristica accuratezza del secondo ordine.

Sostituendo le approssimazioni delle differenze finite nell'equazione riordinata e isolando i coefficienti legati alle funzioni di $\sigma$, $r$, $h$ e $k$, definiamo tre parametri locali estratti dal modello:
$$\alpha_{i}^{j}=\frac{hS}{4k}\left(\frac{\sigma^{2}S}{k}-r\right) , \quad \beta_{i}^{j}=\frac{h}{2}\left(\frac{\sigma^{2}S}{k^{2}}+r\right), \quad \gamma_{i}^{j}=\frac{hS}{4k}\left(\frac{\sigma^{2}S}{k}+r\right)$$

Sostituendo questi coefficienti e separando algebricamente i termini incogniti al tempo precedente (mantenuti a sinistra) da quelli noti al tempo successivo (spostati a destra), l'equazione differenziale per ogni nodo interno $i$ si linearizza nella forma vettoriale:
$$\alpha_{i}^{j+1}V_{i-1}^{j+1}+(1-\beta_{i}^{j+1})V_{i}^{j+1}+\gamma_{i}^{j+1}V_{i+1}^{j+1}=-\alpha_{i}^{j}V_{i-1}^{j}+(1+\beta_{i}^{j})V_{i}^{j}-\gamma_{i}^{j}V_{i+1}^{j}$$

Estendendo questa equazione a tutti i nodi interni della griglia ($i = 1, \dots, M-1$), le relazioni interconnesse si compattano elegantemente in un sistema matriciale globale:
$$A_{L}V^{j+1}+b_{L}=A_{R}V^{j}+b_{R}$$

Qui, le matrici $A_L$ e $A_R$ presentano una struttura strettamente tridiagonale, mentre i vettori di offset $b_L$ e $b_R$ assorbono i valori noti delle condizioni al contorno calcolate ai margini estremi della griglia ($S=0$ e $S_{max}$). Di conseguenza, la propagazione all'indietro nel tempo per determinare il prezzo dell'opzione oggi ($V^j$) richiede la risoluzione sequenziale del sistema lineare ad ogni time-step.

---



## 4. Il Metodo di Crank-Nicolson

*(Inserisci qui i dettagli analitici della griglia tridimensionale e la scomposizione esplicita del sistema di equazioni differenziali espandendo le matrici $A_L$ e $A_R$ come mostrato a lezione)*

---



## 5. Il Cuore dell'Algebra Lineare Numerica: Perché la Decomposizione LU?

*(Spiega qui l'efficienza computazionale legata all'utilizzo dell'algoritmo di Thomas, evidenziando il vantaggio del fattore di complessità lineare $O(M)$ nel calcolo ripetitivo sui nodi interni della matrice tridiagonale)*

---



## 6. Implementazione in MATLAB/Python e Analisi dei Risultati

### Lo Snippet di Codice Computazionale
Oltre allo script MATLAB originale (`crankbs`), di seguito viene riportata l'implementazione equivalente in **Python** altamente ottimizzata per il web. Il codice sfrutta `scipy.sparse` per allocare le matrici tridiagonali e `scipy.sparse.linalg.splu` per calcolare la scomposizione LU una sola volta all'esterno del ciclo, massimizzando le performance computazionali.

```python
import numpy as np
from scipy.sparse import diags
from scipy.sparse.linalg import splu

def crank_nicolson_black_scholes(S_max, E, T, r, sigma, M, N):
    """
    Solves the Black-Scholes PDE for a European Call Option 
    using the Crank-Nicolson scheme and sparse LU decomposition.
    """
    h = T / N  # Time step
    k = S_max / M  # Spatial step
    
    S = np.linspace(0, S_max, M + 1)
    t = np.linspace(0, T, N + 1)
    
    # Initialize price grid
    V = np.zeros((M + 1, N + 1))
    
    # Terminal condition: Call payoff at t = T
    V[:, -1] = np.maximum(S - E, 0)
    
    # Precompute grid coefficients for internal nodes
    idx = np.arange(1, M)
    S_i = S[idx]
    
    alpha = (h * S_i / (4 * k)) * ((sigma**2 * S_i / k) - r)
    beta = (h / 2) * ((sigma**2 * S_i**2 / k**2) + r)
    gamma = (h * S_i / (4 * k)) * ((sigma**2 * S_i / k) + r)
    
    # Construct tridiagonal implicit system matrices (A_L * V^j = A_R * V^{j+1} + offsets)
    A_L = diags([-alpha[1:], 1 + beta, -gamma[:-1]], [-1, 0, 1], shape=(M-1, M-1), format='csc')
    A_R = diags([alpha[1:], 1 - beta, gamma[:-1]], [-1, 0, 1], shape=(M-1, M-1), format='csc')
    
    # Critical step: Compute LU factorization once outside the loop
    A_L_lu = splu(A_L)
    
    # Backward time-stepping loop
    for j in range(N - 1, -1, -1):
        # Update boundary conditions
        V[0, j] = 0
        V[M, j] = S_max - E * np.exp(-r * (T - t[j]))
        
        # Build boundary offsets vector
        offset = np.zeros(M - 1)
        offset[0] = alpha[0] * (V[0, j] + V[0, j+1])
        offset[-1] = gamma[-1] * (V[M, j] + V[M, j+1])
        
        # Compute right-hand side vectors and solve via fast LU substitution
        b = A_R.dot(V[1:M, j+1]) + offset
        V[1:M, j] = A_L_lu.solve(b)
        
    return S, t, V

```
  
### Superficie di Soluzione ed Evoluzione Temporale
I risultati grafici ottenuti dall'algoritmo confermano le proprietà teoriche analizzate nei modelli finanziari. La prima visualizzazione mostra l'andamento del prezzo teorico dell'opzione in base al valore del sottostante e alla frazione temporale che ci separa dalla scadenza.

<figure style="margin: 2rem auto; text-align: center;">
  <a href="/marcoschipani.github.io/calloption.png" target="_blank" rel="noopener noreferrer">
    <img src="/marcoschipani.github.io/calloption.png" alt="Superficie 3D del prezzo della Call europea in funzione di S e t" style="width: 100%; max-width: 900px; height: auto; border-radius: 6px; display: block; margin: 0 auto 0.75rem auto;" />
  </a>
  <figcaption style="font-style: italic; font-size: 0.9rem; opacity: 0.7; max-width: 900px; margin: 0 auto;"><strong>Figura 1:</strong> Superficie di soluzione del prezzo della Call europea al variare del prezzo del sottostante $S$ e del tempo residuo alla scadenza $t$.</figcaption>
</figure>

Si osserva chiaramente come la pendenza si stabilizzi man mano che il tempo scorre verso l'asse della scadenza ($t \rightarrow 0.75$), dove la superficie perde la curvatura e si irrigidisce fino a combaciare esattamente con il profilo dritto del payoff intrinseco dell'opzione.

### Confronto della Soluzione ed Effetto Zoom
Per validare la precisione dello schema numerico rispetto alla soluzione esatta (calcolata in forma chiusa tramite le formule classiche), è utile osservare la sovrapposizione delle due curve sull'intero dominio spaziale del prezzo di esercizio.

<figure style="margin: 2rem auto; text-align: center;">
  <a href="/marcoschipani.github.io/versus.png" target="_blank" rel="noopener noreferrer">
    <img src="/marcoschipani.github.io/versus.png" alt="Confronto tra soluzione numerica Crank-Nicolson e formula analitica di Black-Scholes" style="width: 100%; max-width: 900px; height: auto; border-radius: 6px; display: block; margin: 0 auto 0.75rem auto;" />
  </a>
  <figcaption style="font-style: italic; font-size: 0.9rem; opacity: 0.7; max-width: 900px; margin: 0 auto;"><strong>Figura 2:</strong> Sovrapposizione tra il profilo numerico (Crank-Nicolson) e la soluzione analitica di Black-Scholes sull'intero dominio del prezzo spot $S$.</figcaption>
</figure>

La corrispondenza macroscopica tra i due profili appare ottimale. Tuttavia, per analizzare rigorosamente il comportamento locale del metodo alle differenze finite, è indispensabile effettuare uno zoom millimetrico nell'intorno del punto critico (ovvero nei pressi del valore $S=20$):

<figure style="margin: 2rem auto; text-align: center;">
  <a href="/marcoschipani.github.io/versuszoom.png" target="_blank" rel="noopener noreferrer">
    <img src="/marcoschipani.github.io/versuszoom.png" alt="Zoom sul confronto numerico-analitico in prossimità di S=20" style="width: 100%; max-width: 900px; height: auto; border-radius: 6px; display: block; margin: 0 auto 0.75rem auto;" />
  </a>
  <figcaption style="font-style: italic; font-size: 0.9rem; opacity: 0.7; max-width: 900px; margin: 0 auto;"><strong>Figura 3:</strong> Dettaglio zoom nell'intorno di $S = 20$: lo schema di Crank-Nicolson mantiene uno scostamento locale minimo rispetto alla curva analitica.</figcaption>
</figure>

Grazie a questa vista ravvicinata, si apprezza come lo schema di Crank-Nicolson approssimi la curva analitica mantenendo uno scostamento estremamente limitato, confermando la solidità teorica del metodo del secondo ordine.

### Analisi Quantitativa dell'Errore
Per mappare geometricamente l'andamento di queste discrepanze, l'errore assoluto viene plottato in relazione al prezzo di esercizio dell'asset:

<figure style="margin: 2rem auto; text-align: center;">
  <a href="/marcoschipani.github.io/errores.png" target="_blank" rel="noopener noreferrer">
    <img src="/marcoschipani.github.io/errores.png" alt="Errore assoluto tra soluzione numerica e analitica in funzione del prezzo spot" style="width: 100%; max-width: 900px; height: auto; border-radius: 6px; display: block; margin: 0 auto 0.75rem auto;" />
  </a>
  <figcaption style="font-style: italic; font-size: 0.9rem; opacity: 0.7; max-width: 900px; margin: 0 auto;"><strong>Figura 4:</strong> Errore assoluto $|V_{\text{numerico}} - V_{\text{analitico}}|$ in funzione del prezzo spot $S$. Il picco massimo coincide con la singolarità geometrica del payoff a scadenza.</figcaption>
</figure>

La curva mostra che l'errore tocca il suo massimo in corrispondenza del valore finale, un fenomeno ampiamente noto in letteratura e dovuto alla singolarità geometrica del payoff a scadenza. Per visualizzare la reale microscopicità di questi scostamenti su tutto lo spettro d'azione, è illuminante convertire il grafico applicando una scala logaritmica sull'asse delle ordinate:

<figure style="margin: 2rem auto; text-align: center;">
  <a href="/marcoschipani.github.io/erroreslog.png" target="_blank" rel="noopener noreferrer">
    <img src="/marcoschipani.github.io/erroreslog.png" alt="Errore assoluto in scala logaritmica" style="width: 100%; max-width: 900px; height: auto; border-radius: 6px; display: block; margin: 0 auto 0.75rem auto;" />
  </a>
  <figcaption style="font-style: italic; font-size: 0.9rem; opacity: 0.7; max-width: 900px; margin: 0 auto;"><strong>Figura 5:</strong> Stesso errore assoluto in scala logaritmica: in ampie regioni della griglia lo scostamento scende sotto $10^{-5}$–$10^{-10}$, evidenziando la stabilità numerica del metodo.</figcaption>
</figure>

La rappresentazione in scala logaritmica rivela l'eccezionale precisione del metodo: in ampie porzioni della griglia l'errore precipita al di sotto di soglie minime come $10^{-5}$ o $10^{-10}$, toccando persino i limiti di macchina vicino allo zero. Questo andamento privo di oscillazioni spurie certifica sperimentalmente che l'accoppiata Crank-Nicolson e Decomposizione LU è intrinsecamente stabile e robusta per le applicazioni di ingegneria finanziaria.