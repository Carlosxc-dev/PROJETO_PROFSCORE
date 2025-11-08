import { RefreshToken } from "core/entities/Auth";

export interface IRefreshTokenRepository {
	create(refreshToken: Omit<RefreshToken, "id" | "createdAt">): Promise<RefreshToken>;
	findByToken(token: string): Promise<RefreshToken | null>;
	deleteByToken(token: string): Promise<void>;
	deleteByUserId(userId: string): Promise<void>;
}

export class RefreshTokenRepository implements IRefreshTokenRepository {
	constructor(
		private client: any
	) {}

	async create(tokenData: Omit<RefreshToken, "id" | "createdAt">): Promise<RefreshToken> {
		
		return await this.client.refreshToken.create({
			data: tokenData,
		});
	}

	async findByToken(token: string): Promise<RefreshToken | null> {
		return await this.client.refreshToken.findUnique({
			where: { token: token },
		});
	}

	async deleteByToken(token: string): Promise<void> {
		return await this.client.refreshToken.delete({
			where: { token: token },
		});
	}

	async deleteByUserId(userId: string): Promise<void> {
		return await this.client.refreshToken.deleteMany({
			where: { userId: userId },
		});
	}
}
