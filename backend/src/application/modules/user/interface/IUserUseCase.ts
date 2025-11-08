import {
	InputDTOCreateUser,
	InputDTOUpdateUser,
	InputDTODeleteUser,
	InputDTOGetUserById,
} from "../inputDTO/UserInputDTOs";

import {
	OutputDTOListUsers,
	OutputDTOCreateUser,
	OutputDTOUpdateUser,
	OutputDTODeleteUser,
	OutputDTOGetUserById,
} from "../outputDTO/UserOutputsDTOs";

export interface IUserUseCase {
	getAllUser(): Promise<OutputDTOListUsers>;
	getUserById(dto: InputDTOGetUserById): Promise<OutputDTOGetUserById>;
	getUserByEmail(dto: InputDTOGetUserById): Promise<OutputDTOGetUserById>;
	createUser(dto: InputDTOCreateUser): Promise<OutputDTOCreateUser>;
	updateUser(dto: InputDTOUpdateUser): Promise<OutputDTOUpdateUser>;
	deleteUser(dto: InputDTODeleteUser): Promise<OutputDTODeleteUser>;
}

