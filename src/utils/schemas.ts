import { z } from "zod";

export const healthSchema = z.object({
  ok: z.boolean(),
  service: z.string()
});

export const catalogItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(["track", "station", "episode"])
});

export const catalogSchema = z.object({
  items: z.array(catalogItemSchema).min(5)
});

export const playbackSessionSchema = z.object({
  sessionId: z.string().min(1),
  streamUrl: z.string().url(),
  startedAt: z.string().datetime(),
  slowStartMs: z.number().int().nonnegative().optional()
});

export const eventPayloadSchema = z.object({
  type: z.enum(["PLAYBACK_START", "LIKE", "SKIP"]),
  ts: z.number().int().positive(),
  properties: z.record(z.unknown()).default({})
});
