// app.js
require("./otel.js");
const express = require("express");
const { trace } = require("@opentelemetry/api");
const { logger, getTraceContext } = require("./logger.js");

const app = express();
const port = 3001;

// endpoint simple
app.get("/", (req, res) => {
  res.send("Hello from Node.js app!");
});

// endpoint lent (simulateur de latence)
app.get("/slow", async (req, res) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  res.send("Slow endpoint response");
});

// endpoint lent (simulateur de latence)
app.get("/erreur", async (req, res) => {
  const tracer = trace.getTracer("ma-trace");
  await tracer.startActiveSpan("erreur-span", async (span) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      throw new Error("Something went wrong");
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code:2, message: error.message});
      res.status(500).send("Error endpoint response");
    } finally {
      span.end();
    }
  });
  
});

// endpoint lent (simulateur de latence)
app.get("/custom", async (req, res) => {
  const tracer = trace.getTracer("ma-trace");
  
  await tracer.startActiveSpan("custom-endpoint", async (span) => {
    
    const traceCtx = getTraceContext();
    
    logger.info({
      message: "Processing custom endpoint",
      trace_id: traceCtx.traceId,
      span_id: traceCtx.spanId,
      app: "my-node-app"
    });
        
    await new Promise(resolve => setTimeout(resolve, 500));

    span.setAttribute("custom.attribute", "hello");
    
    span.end();
  });
  res.send("Custom Trace");
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});