import express from "express";
import cors from "cors";

const app = express();
const port = Number(process.env.PORT) || 3001;
const webBaseUrl = process.env.WEB_BASE_URL || "http://localhost:5173";
const webBaseUrls = (process.env.WEB_BASE_URLS || webBaseUrl)
  .split(",")
  .map((entry) => entry.trim())
  .filter(Boolean);
const mode = process.env.MODE || "mock";
const slowStartMsRaw = Number(process.env.SLOW_START_MS || 1200);
const slowStartMs = Number.isFinite(slowStartMsRaw) ? slowStartMsRaw : 1200;

app.use(cors({ origin: webBaseUrls }));
app.use(express.json());

const catalogItems = [
  { id: "trk-101", title: "Midnight Coast", type: "track" },
  { id: "trk-102", title: "Electric Bloom", type: "track" },
  { id: "trk-103", title: "Analog Drift", type: "track" },
  { id: "trk-104", title: "Satellite Echoes", type: "track" },
  { id: "trk-105", title: "Aurora Lines", type: "track" }
];

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "mock-streaming-api" });
});

app.post("/auth/login", (_req, res) => {
  res.json({ token: "mock-token" });
});

app.get("/catalog", (_req, res) => {
  res.json({ items: catalogItems });
});

app.post("/playback/session", (req, res) => {
  const body = req.body as { deviceId?: string; trackId?: string };
  if (!body?.deviceId) {
    return res.status(400).json({ error: "deviceId required" });
  }

  res.json({
    sessionId: `sess-${Date.now()}`,
    streamUrl: "https://www.kozco.com/tech/piano2-CoolEdit.mp3",
    startedAt: new Date().toISOString(),
    slowStartMs: mode === "mock" ? slowStartMs : 0
  });
});

app.post("/events", (req, res) => {
  const body = req.body as { type?: string; ts?: number; properties?: Record<string, unknown> };
  const allowedTypes = new Set(["PLAYBACK_START", "LIKE", "SKIP"]);
  if (!body?.type || typeof body.ts !== "number" || !allowedTypes.has(body.type)) {
    return res.status(400).json({ accepted: false });
  }
  res.json({ accepted: true });
});

if (mode === "mock") {
  app.post("/__test/reset", (_req, res) => {
    res.json({ reset: true });
  });
}

app.listen(port, () => {
  console.log(`Mock Streaming API running on http://localhost:${port}`);
});
