import { IUserRepository } from "core/IRepositories/IUserRepository";
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
import { IUserUseCase } from "../interface/IUserUseCase";
import { User } from "core/entities/user";
import { ErrorHandler } from "api/error/ErrorHandler";
import { IPasswordService } from "infrastructure/services/BcryptPasswordService";

export class UserUseCase implements IUserUseCase {
	constructor(
		private userRepository: IUserRepository,
		private passwordService: IPasswordService
	) {}

	async getAllUser(): Promise<OutputDTOListUsers> {
		const allUsers: User[] = await this.userRepository.getAllUser();
		return { users: allUsers ?? [] }; // Retorna um array vazio se allUsers for null ou undefined
	}

	async getUserById(dto: InputDTOGetUserById): Promise<OutputDTOGetUserById> {
		const user = await this.userRepository.findUserById(dto.id);
		if (!user) throw new ErrorHandler(404, "Id User not found");
		return { user: user };
	}

	async getUserByEmail(dto: InputDTOGetUserById): Promise<OutputDTOGetUserById> {
		const user = await this.userRepository.getUserByEmail(dto.id);
		if (user) throw new ErrorHandler(404, "Email already in use");
		return { user: user };
	}

	async createUser(dto: InputDTOCreateUser): Promise<OutputDTOCreateUser> {
		const hashedPassword = await this.passwordService.hash(dto.password);

		const newUser = new User(
			dto.name,
			dto.email,
			new Date(),
			new Date(),
			dto.type,
			dto.access,
			hashedPassword,
			undefined,
			dto.farmId === undefined ? null : dto.farmId
		);

		const response: User = await this.userRepository.createUser(newUser);
		return { user: response };
	}

	async deleteUser(dto: InputDTODeleteUser): Promise<OutputDTODeleteUser> {
		const response = await this.userRepository.deleteUser(dto.id);
		return { user: response };
	}

	async updateUser(dto: InputDTOUpdateUser): Promise<OutputDTOUpdateUser> {
		const userToUpdate = await this.userRepository.findUserById(dto.id);
		if (!userToUpdate) throw new ErrorHandler(404, "User not found");

		let password: string = "";
		const passwordChanged = dto.password && dto.password !== userToUpdate.password;

		if (passwordChanged) {
			password = await this.passwordService.hash(dto.password ?? userToUpdate.password!);
		} else {
			password = userToUpdate.password!;
		}

		const updatedUser = new User(
			dto.name ?? userToUpdate["name"],
			dto.email ?? userToUpdate["email"],
			userToUpdate["createdAt"],
			new Date(),
			dto.type ?? userToUpdate["type"],
			dto.access ?? userToUpdate["access"],
			password,
			dto.id,
			dto.farmId === undefined ? null : dto.farmId
		);

		const response = await this.userRepository.updateUser(updatedUser);
		return { user: response };
	}
}

