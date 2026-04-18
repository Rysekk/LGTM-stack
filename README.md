# Stack d'Observabilité LGTM (Setup type production)

Ce projet est une stack complète d'observabilité basée sur l'écosystème **LGTM** :

- Logs → **Loki**
- Traces → **Tempo**
- Métriques → **Prometheus**
- Ingestion → **OpenTelemetry Collector** + **Grafana Alloy**
- Visualisation → **Grafana**

Il permet de mettre en place une chaîne complète d'observabilité avec **corrélation logs ↔ traces ↔ métriques**.

---

## Architecture

```text
┌────────────────────┐
│   Application Node │
│ (OpenTelemetry SDK)│
└─────────┬──────────┘
          │
          ▼
 ┌───────────────────┐
 │ OpenTelemetry     │
 │ Collector         │
 │ (Traces/Metrics)  │
 └──────┬─────┬──────┘
        │     │
        ▼     ▼
      Tempo   Prometheus

Logs JSON
   ▼
Grafana Alloy
   ▼
Loki
   ▼
Grafana (UI)
```

---

## Fonctionnalités

### Corrélation

- Logs ↔ Traces (via `trace_id`)
- Traces ↔ Métriques (via `service.name`)
- Logs ↔ Métriques (via labels)


### Application Node.js auto-instrumentée

Application instrumentée automatiquement avec OpenTelemetry pour Express et HTTP.

### Architecture native OpenTelemetry

Architecture basée entièrement sur les standards OpenTelemetry pour la corrélation des traces, métriques et logs.

### Prêt pour des scénarios de chaos / debug

Conçu pour simuler des scénarios réels : latence, erreurs et pics de trafic afin de tester l'observabilité.

---

## Démarrage rapide

### 1. Lancer la stack

```bash
docker compose up -d
```

### 2. Lancer l'application Node.js

```bash
cd app
node app.js
```

### 3. Générer du trafic

```bash
curl http://localhost:3001/
curl http://localhost:3001/slow
curl http://localhost:3001/custom

for i in {1..20}; do curl -s http://localhost:3001/; done
```

---

## Accès aux interfaces

| Service | URL |
|---|---|
| Grafana | http://localhost:3000 |
| Prometheus | http://localhost:9090 |
| Loki | http://localhost:3100 |
| Tempo | http://localhost:3200 |
| Alloy UI | http://localhost:12345 |

---

## Exploration des données dans Grafana

### Traces (Tempo)

1. Aller dans **Explore**
2. Sélectionner **Tempo**
3. Rechercher par `service.name = my-node-app`
4. Cliquer sur une trace pour voir les spans

### Logs (Loki)

1. Aller dans **Explore**
2. Sélectionner **Loki**
3. Requête :

```logql
{app="my-node-app"}
```

4. Parser JSON :

```logql
{app="my-node-app"} | json
```

### Métriques (Prometheus)

Exemples de requêtes :

```promql
rate(http_server_duration_milliseconds_count[1m])
```

```promql
histogram_quantile(0.95, rate(http_server_duration_milliseconds_bucket[5m]))
```

### Corrélation logs ↔ traces

Les logs contiennent un `trace_id`. Dans Grafana :

- Cliquer sur un log
- Ouvrir la trace associée directement dans Tempo

---

## Stack technique

| Composant | Rôle |
|---|---|
| [OpenTelemetry](https://opentelemetry.io/) | Standard d'instrumentation |
| [Grafana](https://grafana.com/) | Visualisation |
| [Loki](https://grafana.com/oss/loki/) | Stockage des logs |
| [Tempo](https://grafana.com/oss/tempo/) | Stockage des traces |
| [Prometheus](https://prometheus.io/) | Stockage des métriques |
| [Grafana Alloy](https://grafana.com/docs/alloy/latest/) | Collecte et routage des logs |
| [Node.js / Express](https://expressjs.com/) | Application instrumentée |

---

## Dépannage

### Les traces ne remontent pas

```bash
docker logs otel-collector --tail 50
```

### Les logs ne remontent pas

```bash
docker logs alloy --tail 50
```

### Vérifier Loki

```bash
curl http://localhost:3100/ready
```

### Vérifier Prometheus

```bash
curl http://localhost:9090/targets
```

---

## Objectif du projet

Ce projet a pour but de démontrer :

- La mise en place d'une stack d'observabilité complète
- La corrélation entre logs, traces et métriques
- L'instrumentation d'une application Node.js
- Les bonnes pratiques OpenTelemetry