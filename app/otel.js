const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { defaultResource, resourceFromAttributes } = require("@opentelemetry/resources");
const { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } = require("@opentelemetry/semantic-conventions");

if (process.__otel_sdk__) {
  console.log("OTEL already initialized, skipping...");
  return;
}

process.__otel_sdk__ = true;

console.log("OTEL INIT START");

const traceExporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces",
});

const metricExporter = new OTLPMetricExporter({
  url: "http://localhost:4318/v1/metrics",
});


const resource = defaultResource().merge(
  resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "my-node-app",
    [ATTR_SERVICE_VERSION]: "0.1.0",
  })
);

const sdk = new NodeSDK({
  traceExporter,
  metricExporter,
  instrumentations: [getNodeAutoInstrumentations(), new HttpInstrumentation()],
  resource,
});

sdk.start();

console.log("OpenTelemetry SDK initialized");