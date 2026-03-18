import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3001;
const OLLAMA_BASE = "http://localhost:11434";

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", async (req, res) => {
  try {
    const r = await fetch(`${OLLAMA_BASE}/api/tags`);
    const data = await r.json();
    res.json({ status: "ok", models: data.models?.map((m) => m.name) || [] });
  } catch {
    res.status(503).json({ status: "error", message: "Ollama not reachable" });
  }
});

// Streaming chat endpoint
app.post("/chat", async (req, res) => {
  const { messages, model = "llama3.2:latest" } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array required" });
  }

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  try {
    const ollamaRes = await fetch(`${OLLAMA_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });

    if (!ollamaRes.ok) {
      const err = await ollamaRes.text();
      res.write(`data: ${JSON.stringify({ error: err })}\n\n`);
      return res.end();
    }

    // Stream chunks from Ollama to client
    for await (const chunk of ollamaRes.body) {
      const lines = chunk.toString().split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          const token = json?.message?.content ?? "";
          const done = json?.done ?? false;
          res.write(`data: ${JSON.stringify({ token, done })}\n\n`);
          if (done) {
            res.end();
            return;
          }
        } catch {
          // skip malformed chunks
        }
      }
    }
    res.write(`data: ${JSON.stringify({ token: "", done: true })}\n\n`);
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 AI_Engine server running at http://localhost:${PORT}`);
  console.log(`📡 Connecting to Ollama at ${OLLAMA_BASE}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /health  — check Ollama connection`);
  console.log(`  POST /chat    — streaming chat\n`);
});
