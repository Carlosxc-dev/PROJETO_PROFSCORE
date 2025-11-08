// src/schemas/feedlot.schema.ts
import { z } from "zod";

// Coordinate schema (reaproveita)
const coordinateSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

// CREATE Feedlot
const createFeedlotSchema = z.object({
  name: z.string().min(2).max(100),
  coordinate: coordinateSchema,
  farmId: z.string().uuid(),
  cows: z.array(z.string().uuid()).optional(),
  image4K: z.array(z.string().uuid()).optional(),
});

// UPDATE Feedlot
const updateFeedlotSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100).optional(),
  coordinate: coordinateSchema.optional(),
  cows: z.array(z.string().uuid()).optional(),
  image4K: z.array(z.string().uuid()).optional(),
  farmId: z.string().uuid().optional(),
});

// DELETE Feedlot
const deleteFeedlotSchema = z.object({
  id: z.string().uuid(),
});

// GET Feedlot by ID
const getFeedlotByIdSchema = z.object({
  id: z.string().uuid(),
});

export {
  createFeedlotSchema,
  updateFeedlotSchema,
  deleteFeedlotSchema,
  getFeedlotByIdSchema,
};
