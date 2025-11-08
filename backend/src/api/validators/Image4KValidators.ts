// schemas/Image4K.schema.ts
import { z } from "zod";

const coordinateSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
});

const createImage4KSchema = z.object({
	coordinates: coordinateSchema,
	idFolder: z.string(),
	userId: z.uuid(),
	totalImagesRequest: z.number().optional(),
	feedlotId: z.uuid(),
	statusRequest: z.string(),
});

const updateImage4KSchema = z.object({
	id: z.uuid(),
	coordinates: coordinateSchema.optional(),
	idFolder: z.string().optional(),
	userId: z.uuid().optional(),
	totalImagesRequest: z.number().optional(),
	feedlotId: z.uuid().optional(),
	statusRequest: z.string().optional(),
});

const deleteImage4KSchema = z.object({
	id: z.uuid(),
});

const getImage4KByIdSchema = z.object({
	id: z.uuid(),
});

export { createImage4KSchema, updateImage4KSchema, deleteImage4KSchema, getImage4KByIdSchema };

