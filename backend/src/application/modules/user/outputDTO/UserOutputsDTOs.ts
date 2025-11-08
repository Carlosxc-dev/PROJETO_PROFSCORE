import { User } from "core/entities/user";

interface OutputDTOCreateUser {
	user: User;
}

interface OutputDTOUpdateUser {
	user: User ;
}

interface OutputDTODeleteUser {
	user: User;
}

interface OutputDTOGetUserById {
	user: User | null;
}

interface OutputDTOListUsers {
	users: User[];
}

export {
	OutputDTOCreateUser,
	OutputDTOUpdateUser,
	OutputDTODeleteUser,
	OutputDTOGetUserById,
	OutputDTOListUsers,
};
