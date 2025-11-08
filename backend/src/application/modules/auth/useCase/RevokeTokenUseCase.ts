import { IRefreshTokenRepository } from "infrastructure/database/repository/RefreshTokenRepository";
import { IRevokeTokenUseCase } from "../interface/IRevokeTokenUseCase";
import { ErrorHandler } from "api/error/ErrorHandler";

export class RevokeTokenUseCase implements IRevokeTokenUseCase {
	constructor(private refreshTokenRepository: IRefreshTokenRepository) {}

	async execute(refreshToken: string): Promise<void> {
		const isValid = await this.refreshTokenRepository.findByToken(refreshToken);
		if (!isValid) throw new ErrorHandler(401, "Invalid refresh token");
		await this.refreshTokenRepository.deleteByToken(refreshToken);
		
	}
}
