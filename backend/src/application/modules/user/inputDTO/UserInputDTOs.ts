import { Access } from "core/enums/access";
import { UserType } from "core/enums/userType";

interface InputDTOCreateUser {
	name: string;
	email: string;
	password: string;
	type: UserType;
	access: Access;
	farmId?: string;
}

interface InputDTOUpdateUser {
	id: string;
	name?: string;
	email?: string;
	password?: string;
	type?: UserType;
	access?: Access;
	farmId?: string;
}

interface InputDTODeleteUser {
	id: string;
}

interface InputDTOGetUserById {
	id: string;
}

export { InputDTOCreateUser, InputDTOUpdateUser, InputDTODeleteUser, InputDTOGetUserById };

