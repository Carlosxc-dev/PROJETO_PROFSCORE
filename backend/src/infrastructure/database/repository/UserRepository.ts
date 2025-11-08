import { User } from "core/entities/user";
import { IUserRepository } from "core/IRepositories/IUserRepository";

export class UserRepository implements IUserRepository {
	constructor(private client: any) {}
	private selectFieldsUser = {
		id: true,
		name: true,
		email: true,
		password: false,
		createdAt: true,
		updatedAt: true,
		type: true,
		access: true,
		farm: false,
		farmId: true,
	};

	async findUserById(userId: string): Promise<User | null> {
		return await this.client.user.findUnique({
			where: { id: userId },
			select: this.selectFieldsUser,
		});
	}

	async getUserByEmail(email: string): Promise<User | null> {
		return await this.client.user.findUnique({
			where: { email: email },
			select: {
				...this.selectFieldsUser,
				password: true,
			}
		});
	}

	async getMe(idUser: string): Promise<User | null> {
		return await this.client.user.findUnique({
			where: { id: idUser },
			select: this.selectFieldsUser,
		});
	}

	async getAllUser(): Promise<User[]> {
		const allUser: User[] = await this.client.user.findMany({
			select: this.selectFieldsUser,
			orderBy: { createdAt: "desc" },
		});
		return allUser;
	}

	async createUser(userData: User): Promise<User> {
		return await this.client.user.create({
			data: userData,
			select: this.selectFieldsUser,
		});
	}

	async updateUser(userData: User): Promise<User> {
		return await this.client.user.update({
			where: { id: userData.id },
			data: userData,
			select: this.selectFieldsUser,
		});
	}

	async deleteUser(userId: string): Promise<User> {
		return await this.client.user.delete({
			where: { id: userId },
		});
	}

	async addFarmToUser(userId: string, farmId: string): Promise<void> {
		await this.client.user.update({
			where: { id: userId },
			data: {
				farmId: {
					push: farmId, // Prisma entende push aqui
				},
			},
		});
	}

	async removeFarmFromUser(userId: string, farmId: string): Promise<void> {
		// Pega o array atual de farms do usuário
		const user = await this.client.user.findUnique({
			where: { id: userId },
			select: { farms: true },
		});

		// Atualiza o array removendo o farmId
		await this.client.user.update({
			where: { id: userId },
			data: {
				farms: (user?.farms || []).filter((id: string) => id !== farmId),
			},
		});
	}
}

