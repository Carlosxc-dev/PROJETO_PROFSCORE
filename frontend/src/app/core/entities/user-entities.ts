import { Access } from "../enums/access";
import { UserType } from "../enums/userType";

export interface User {
	name: string;
	email: string;
	password: string;
	type: string;
	access: string;
	createdAt: Date;
	updatedAt: Date;
	farms?: string[];
	id?: number;
}

export interface InputDTOCreateUser {
	name: string;
	email: string;
	password: string;
	type: UserType;
	access: Access;
	farms?: string[] ;
}

export interface InputDTOUpdateUser {
	id: string;
	name?: string;
	email?: string;
	password?: string;
	type?: UserType;
	access?: Access;
	farms?: string[];
}

export interface InputDTODeleteUser {
	id: string;
}

export interface InputDTOGetUserById {
	id: string;
}

export interface OutputDTOCreateUser {
	user: User;
}

export interface OutputDTOUpdateUser {
	user: User ;
}

export interface OutputDTODeleteUser {
	user: User;
}

export interface OutputDTOGetUserById {
	user: User | null;
}

export interface OutputDTOListUsers {
	users: User[];
}