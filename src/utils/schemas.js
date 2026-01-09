const { z } = require("zod");

const healthSchema = z.object({
  ok: z.boolean(),
  service: z.string()
});

const catalogItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(["track", "station", "episode"])
});

const catalogSchema = z.object({
  items: z.array(catalogItemSchema).min(5)
});

const playbackSessionSchema = z.object({
  sessionId: z.string().min(1),
  streamUrl: z.string().url(),
  startedAt: z.string().datetime(),
  slowStartMs: z.number().int().nonnegative().optional()
});

const eventPayloadSchema = z.object({
  type: z.enum(["PLAYBACK_START", "LIKE", "SKIP"]),
  ts: z.number().int().positive(),
  properties: z.record(z.unknown()).default({})
});

module.exports = {
  healthSchema,
  catalogItemSchema,
  catalogSchema,
  playbackSessionSchema,
  eventPayloadSchema
};
