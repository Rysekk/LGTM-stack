# LGTM Observability Stack

This project is a complete observability stack built on the **LGTM** ecosystem:

- Logs → **Loki**
- Traces → **Tempo**
- Metrics → **Prometheus**
- Ingestion → **OpenTelemetry Collector** + **Grafana Alloy**
- Visualization → **Grafana**

It sets up a full observability pipeline with **logs ↔ traces ↔ metrics correlation**.

---

## Architecture

```text
┌────────────────────┐
│   Node Application │
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

JSON Logs
   ▼
Grafana Alloy
   ▼
Loki
   ▼
Grafana (UI)
```

---

## Features

### Correlation

- Logs ↔ Traces (via `trace_id`)
- Traces ↔ Metrics (via `service.name`)
- Logs ↔ Metrics (via labels)

### Auto-instrumented Node.js application

Application automatically instrumented with OpenTelemetry for Express and HTTP.

### OpenTelemetry-native architecture

Architecture built entirely on OpenTelemetry standards to correlate traces, metrics and logs.

### Ready for chaos / debugging scenarios

Designed to simulate real-world scenarios — latency, errors and traffic spikes — to put the observability stack to the test.

---

## Quick Start

### 1. Start the stack

```bash
docker compose up -d
```

### 2. Start the Node.js application

```bash
cd app
node app.js
```

### 3. Generate traffic

```bash
curl http://localhost:3001/
curl http://localhost:3001/slow
curl http://localhost:3001/custom

for i in {1..20}; do curl -s http://localhost:3001/; done
```

---

## Accessing the UIs

| Service | URL |
|---|---|
| Grafana | http://localhost:3000 |
| Prometheus | http://localhost:9090 |
| Loki | http://localhost:3100 |
| Tempo | http://localhost:3200 |
| Alloy UI | http://localhost:12345 |

---

## Exploring Data in Grafana

### Traces (Tempo)

1. Go to **Explore**
2. Select **Tempo**
3. Search by `service.name = my-node-app`
4. Click a trace to view its spans

### Logs (Loki)

1. Go to **Explore**
2. Select **Loki**
3. Query:

```logql
{app="my-node-app"}
```

4. Parse JSON:

```logql
{app="my-node-app"} | json
```

### Metrics (Prometheus)

Example queries:

```promql
rate(http_server_duration_milliseconds_count[1m])
```

```promql
histogram_quantile(0.95, rate(http_server_duration_milliseconds_bucket[5m]))
```

### Logs ↔ Traces correlation

Logs include a `trace_id`.

In Grafana:
- Click a log line
- Open the associated trace directly in Tempo

---

## Tech Stack

| Component | Role |
|---|---|
| [OpenTelemetry](https://opentelemetry.io/) | Instrumentation standard |
| [Grafana](https://grafana.com/) | Visualization |
| [Loki](https://grafana.com/oss/loki/) | Log storage |
| [Tempo](https://grafana.com/oss/tempo/) | Trace storage |
| [Prometheus](https://prometheus.io/) | Metrics storage |
| [Grafana Alloy](https://grafana.com/docs/alloy/latest/) | Log collection and routing |
| [Node.js / Express](https://expressjs.com/) | Instrumented application |

---

## Troubleshooting

### Traces are not showing up

```bash
docker logs otel-collector --tail 50
```

### Logs are not showing up

```bash
docker logs alloy --tail 50
```

### Check Loki

```bash
curl http://localhost:3100/ready
```

### Check Prometheus

```bash
curl http://localhost:9090/targets
```

---

## Project Goals

This project aims to demonstrate:

- Setting up a complete observability stack
- Correlating logs, traces and metrics
- Instrumenting a Node.js application
- OpenTelemetry best practices
