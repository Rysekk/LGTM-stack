const pino = require("pino");
const { context, trace } = require("@opentelemetry/api");

const logger = pino(
  {
    level: "info",
  },
  pino.destination("./logs/app.log")
);

// Middleware pour ajouter le traceId à chaque log
function getTraceContext() {
  const span = trace.getSpan(context.active());
  if (!span) return {};
  const spanContext = span.spanContext();
  return {
    traceId: spanContext.traceId,
    spanId: spanContext.spanId,
  };
}

module.exports = {
  logger,
  getTraceContext,
};