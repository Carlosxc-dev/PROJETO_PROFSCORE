// src/schemas/cow.schema.ts
import { z } from "zod";
import { State } from "core/enums/state";
import { Position } from "core/enums/position";

// CREATE Cow
const createCowSchema = z.object({
	state: z.enum(State),
	position: z.enum(Position),
	feedlotId: z.uuid(),
});

// UPDATE Cow
const updateCowSchema = z.object({
	id: z.string().uuid(),
	state: z.enum(State).optional(),
	position: z.enum(Position).optional(),
	feedlotId: z.uuid().optional(),
});

// DELETE Cow
const deleteCowSchema = z.object({
	id: z.uuid(),
});

// GET Cow by ID
const getCowByIdSchema = z.object({
	id: z.uuid(),
});

export { createCowSchema, updateCowSchema, deleteCowSchema, getCowByIdSchema };

