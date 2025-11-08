// schemas/user.schema.ts
import { z } from "zod";
import { UserType } from "core/enums/userType";
import { Access } from "core/enums/access";

const createUserSchema = z.object({
	name: z.string().min(2).max(50),
	email: z.email(),
	password: z.string().min(6).max(100),
	type: z.enum(UserType),
	access: z.enum(Access),
	farmId: z.uuid().optional(),
});

const updateUserSchema = z.object({
	id: z.uuid(),
	name: z.string().min(2).max(50).optional(),
	email: z.email().optional(),
	password: z.string().min(6).max(100).optional(),
	type: z.enum(UserType).optional(),
	access: z.enum(Access).optional(),
	farmId: z.uuid().optional(),
});

const deleteUserSchema = z.object({
	id: z.uuid(),
});

const getUserByIdSchema = z.object({
	id: z.uuid(),
});

export { createUserSchema, updateUserSchema, deleteUserSchema, getUserByIdSchema };

