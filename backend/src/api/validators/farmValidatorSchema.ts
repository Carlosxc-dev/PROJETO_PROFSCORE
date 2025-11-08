// src/schemas/farm.schema.ts
import { z } from "zod";
// Para simplificação, vamos assumir que Address e Coordinate são representados como objetos simples.
// Caso tenha seus próprios validators, substitua aqui pelos schemas respectivos.

const addressSchema = z.object({
  city: z.string().min(1),
  state: z.string().min(1),
});

const coordinateSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

// CREATE Farm
const createFarmSchema = z.object({
  name: z.string().min(2).max(100),
  address: addressSchema,
  coordinates: coordinateSchema,
  license: z.string().min(2).max(50).optional(),
});

// UPDATE Farm
const updateFarmSchema = z.object({
  id: z.uuid(),
  name: z.string().min(2).max(100).optional(),
  address: addressSchema.optional(),
  coordinates: coordinateSchema.optional(),
  license: z.string().min(2).max(50).optional(),
});

// DELETE Farm
const deleteFarmSchema = z.object({
  id: z.uuid(),
});

// GET Farm by ID
const getFarmByIdSchema = z.object({
  id: z.uuid(),
});

export {
  createFarmSchema,
  updateFarmSchema,
  deleteFarmSchema,
  getFarmByIdSchema,
};
