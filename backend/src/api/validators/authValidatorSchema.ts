// schemas/user.schema.ts
import { z } from "zod";


const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(6).max(100),
});

const logoutSchema = z.object({
	id: z.uuid(),
});

export { 
	loginSchema,
	logoutSchema
 };

