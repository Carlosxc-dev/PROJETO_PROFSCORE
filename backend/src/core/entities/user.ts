// src/core/entities/User.ts
import { Access } from "core/enums/access";
import { UserType } from "../enums/userType";

export class User {
	constructor(
		public name: string,
		public email: string,
		public createdAt: Date = new Date(),
		public updatedAt: Date = new Date(),
		public type: UserType,
		public access: Access,
		public password?: string,
		public id?: string,
		public farmId?: string | null,
		
	) {}
}

