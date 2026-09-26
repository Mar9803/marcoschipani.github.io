export type StoryNode = {
  key: string;
  icon: string;
  title: string;
  sub?: string;
  problema: string;
  soluzione: string;
  children?: StoryNode[];
};

export type StoryDataset = {
  trade_title: string;
  trade: [string, string][];
  root: StoryNode;
};

export const SYSTEM_DESIGN_DATA: Record<string, StoryDataset> = {
  sys: {
    trade_title: "Ogni componente aggiunto è anche un nuovo modo di rompersi",
    trade: [
      ["Microservizi", "introducono network failures tra servizi"],
      ["Sharding", "rende le query cross-partizione più difficili"],
      ["Cache", "può andare stale (dati non aggiornati)"],
      ["Queue", "può consegnare un messaggio due volte"],
      ["Repliche DB", "possono andare in lag rispetto al master"],
    ],
    root: {
      key: "users",
      icon: "👥",
      title: "Users",
      sub: "phones · browser",
      problema:
        "Un prodotto nuovo (es. un social) con post, upload, messaggi: da qualche parte devono entrare gli utenti.",
      soluzione:
        "Punto di partenza concettuale: gli utenti che generano traffico verso il sistema.",
      children: [
        {
          key: "lb",
          icon: "⚖️",
          title: "Load Balancer",
          sub: "NGINX · ELB",
          problema:
            "Il traffico cresce e un solo server non regge più (scaling verticale ha un tetto).",
          soluzione:
            "Passi a più server in parallelo (scaling orizzontale); serve un punto d'ingresso unico che distribuisca le richieste: il Load Balancer.",
          children: [
            {
              key: "servers",
              icon: "🖥️",
              title: "Server Pool",
              sub: "app ×N",
              problema:
                "Con più server la logica applicativa gira ovunque, ma ora emergono nuovi colli di bottiglia a valle.",
              soluzione:
                "Ogni server è stateless e replicabile; da qui il sistema si dirama in più responsabilità.",
              children: [
                {
                  key: "storage",
                  icon: "🗄️",
                  title: "Storage + CDN",
                  sub: "S3 · edge cache",
                  problema:
                    "Post e upload includono file pesanti (immagini/video) che non stanno bene in un DB relazionale.",
                  soluzione:
                    "Sposti i file su storage dedicato (S3) servito da una CDN vicina geograficamente all'utente.",
                },
                {
                  key: "cache",
                  icon: "⚡",
                  title: "Cache",
                  sub: "Redis · memoria",
                  problema:
                    "Tutti i server colpiscono lo stesso DB per le stesse letture ripetute, che diventa il collo di bottiglia.",
                  soluzione:
                    "Aggiungi una cache in-memory (Redis) davanti al DB per evitare letture non necessarie.",
                  children: [
                    {
                      key: "dbcluster",
                      icon: "🗃️",
                      title: "DB Cluster",
                      sub: "repliche",
                      problema:
                        "Anche con la cache, scritture e letture non cacheable saturano un DB singolo.",
                      soluzione:
                        "Crei repliche in lettura del DB (cluster): le letture si distribuiscono, le scritture restano sul primary.",
                      children: [
                        {
                          key: "shard1",
                          icon: "🧩",
                          title: "Shard 1",
                          sub: "users A-M",
                          problema:
                            "Nemmeno le repliche bastano: troppi dati/scritture per un unico DB logico.",
                          soluzione:
                            "Partizioni gli utenti per range (sharding): shard 1 con replica-primary-replica indipendente.",
                        },
                        {
                          key: "shard2",
                          icon: "🧩",
                          title: "Shard 2",
                          sub: "users N-Z",
                          problema:
                            "Stesso limite di scala del primo shard, applicato a un'altra fetta di utenti.",
                          soluzione:
                            "Secondo shard indipendente, stesso pattern replica-primary-replica.",
                        },
                      ],
                    },
                  ],
                },
                {
                  key: "queue",
                  icon: "📥",
                  title: "Queue",
                  sub: "jobs wait here",
                  problema:
                    "Operazioni lente (notifiche, elaborazione video) bloccano la risposta immediata all'utente.",
                  soluzione:
                    "Le metti in una coda ed elaborate in modo asincrono, disaccoppiando richiesta e lavoro pesante.",
                  children: [
                    {
                      key: "workers",
                      icon: "⚙️",
                      title: "Workers",
                      sub: "slow jobs",
                      problema:
                        "Qualcuno deve effettivamente consumare i job accodati, senza bloccare i server applicativi.",
                      soluzione:
                        "Worker dedicati, scalabili indipendentemente, che processano la coda in background.",
                    },
                  ],
                },
                {
                  key: "observability",
                  icon: "📊",
                  title: "Observability",
                  sub: "logs · metrics · traces",
                  problema:
                    "Con tanti pezzi distribuiti, capire 'cosa sta succedendo' diventa impossibile a occhio.",
                  soluzione:
                    "Logs, metriche e traces centralizzati per avere visibilità end-to-end sul sistema.",
                },
                {
                  key: "resilience",
                  icon: "🛡️",
                  title: "Resilience",
                  sub: "failover",
                  problema:
                    "Un server crasha o un DB va down: il sistema non deve fermarsi per un singolo guasto.",
                  soluzione:
                    "Ridondanza e failover automatico, così la rottura di un pezzo non compromette il resto.",
                },
                {
                  key: "microservizi",
                  icon: "🧭",
                  title: "Microservizi",
                  sub: "Kafka · K8s",
                  problema:
                    "Il monolite distribuito è diventato troppo grande e rischioso da far evolvere in un solo blocco.",
                  soluzione:
                    "Scomponi in microservizi coordinati da Kubernetes, con Kafka per la comunicazione asincrona. Non è un default da principianti: aggiunge complessità reale.",
                },
              ],
            },
          ],
        },
      ],
    },
  },
  ml: {
    trade_title:
      "Anche in ML, ogni layer risolve un problema ma ne introduce un altro",
    trade: [
      ["Feature Store", "aggiunge infrastruttura extra da mantenere"],
      [
        "Retraining automatico",
        "rischia di allenarsi su dati corrotti o in feedback loop",
      ],
      [
        "Serving separato dal training",
        "introduce latenza di rete tra servizi",
      ],
      [
        "Monitoring",
        "genera falsi allarmi se le soglie non sono calibrate bene",
      ],
    ],
    root: {
      key: "notebook",
      icon: "📓",
      title: "Notebook + Modello",
      sub: "dataset statico",
      problema:
        "Hai un obiettivo di business (es. rilevare frodi) da tradurre in un problema ML.",
      soluzione:
        "Alleni un modello in un notebook su un dataset statico: funziona bene offline, ma non serve ancora nessuno.",
      children: [
        {
          key: "dataeng",
          icon: "🏗️",
          title: "Data Engineering",
          sub: "ETL · streaming",
          problema:
            "I dati grezzi crescono, arrivano da più fonti e in parte in tempo reale (transazioni live).",
          soluzione:
            "Pipeline di data engineering (ETL, data lake, stream processing) per alimentare training e feature in modo affidabile.",
        },
        {
          key: "exptrack",
          icon: "🧪",
          title: "Experiment Tracking",
          sub: "MLflow",
          problema:
            "Con tanti esperimenti e versioni di modello, diventa impossibile ricordare cosa ha funzionato e perché.",
          soluzione:
            "Experiment tracking e model registry per versionare dati, codice e modelli.",
        },
        {
          key: "serving",
          icon: "🚀",
          title: "Serving/Deployment",
          sub: "batch · online",
          problema:
            "Il modello deve dare predizioni a utenti/sistemi reali, non solo dentro un notebook.",
          soluzione:
            "Livello di serving (batch o online prediction) che espone il modello via API.",
          children: [
            {
              key: "featurestore",
              icon: "🧬",
              title: "Feature Store",
              sub: "shared features",
              problema:
                "Le feature calcolate in training (offline) e in produzione (online) non coincidono sempre: training-serving skew.",
              soluzione:
                "Centralizzi il calcolo delle feature in un feature store condiviso tra training e serving.",
            },
            {
              key: "evaluation",
              icon: "📏",
              title: "Evaluation",
              sub: "offline+online",
              problema:
                "Come sai se il nuovo modello è davvero meglio prima di sostituire quello in produzione?",
              soluzione:
                "Valuti offline su metriche note, poi testi online con shadow deployment, canary o A/B test.",
              children: [
                {
                  key: "monitoring",
                  icon: "🔍",
                  title: "Monitoring",
                  sub: "drift · alerting",
                  problema:
                    "Il mondo cambia: la distribuzione dei dati si sposta (concept drift) e il modello degrada silenziosamente.",
                  soluzione:
                    "Monitori data drift e performance in produzione, con alerting quando le metriche peggiorano.",
                  children: [
                    {
                      key: "continual",
                      icon: "🔁",
                      title: "Continual Learning",
                      sub: "auto-retrain",
                      problema:
                        "Riaddestrare manualmente il modello ogni volta non scala col numero di modelli/frequenza necessaria.",
                      soluzione:
                        "Pipeline di retraining automatico, innescate da drift o su schedule, con validazione prima del deploy.",
                    },
                  ],
                },
              ],
            },
            {
              key: "explain",
              icon: "🔎",
              title: "Explainability",
              sub: "SHAP",
              problema:
                "In fraud detection serve giustificare le decisioni (compliance, fiducia degli analisti).",
              soluzione:
                "Strumenti di interpretabilità per spiegare perché il modello ha flaggato un caso.",
            },
          ],
        },
      ],
    },
  },
};
