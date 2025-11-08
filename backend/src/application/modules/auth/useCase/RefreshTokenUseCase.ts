import { IRefreshTokenUseCase } from "../interface/IRefreshTokenUseCase";
import { ErrorHandler } from "api/error/ErrorHandler";
import { AuthTokens } from "core/entities/Auth";
import { IUserRepository } from "core/IRepositories/IUserRepository";
import { IRefreshTokenRepository } from "infrastructure/database/repository/RefreshTokenRepository";
import { ITokenService, JwtTokenPayload } from "infrastructure/services/JwtTokenService";

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
	constructor(
		private userRepository: IUserRepository,
		private refreshTokenRepository: IRefreshTokenRepository,
		private tokenService: ITokenService
	) {}

	async execute(refreshToken: string): Promise<AuthTokens> {
		const tokenRecord = await this.refreshTokenRepository.findByToken(refreshToken);
		if (!tokenRecord) {
			throw new ErrorHandler(401, "Invalid refresh token");
		}


		if (
			tokenRecord.expiresAt instanceof Date &&
			tokenRecord.expiresAt <= new Date()
		) {
			await this.refreshTokenRepository.deleteByToken(refreshToken);
			throw new ErrorHandler(401, "Refresh token has expired");
		}

		const user = await this.userRepository.findUserById(tokenRecord.userId);
		if (!user) {
			throw new ErrorHandler(404, "User not found");
		}

		const payload: JwtTokenPayload = {
			userId: user["id"]!,
			name: user["name"],
			email: user["email"],
			type: user["type"],
			access: user["access"],
		};

		// Generate new tokens
		const newAccessToken = this.tokenService.generateAccessToken(payload);
		const newRefreshToken = this.tokenService.generateRefreshToken(payload);

		const accessTokenExpiration = this.tokenService.getAccessTokenExpiration(newAccessToken);
		const refreshTokenExpiration = this.tokenService.getRefreshTokenExpiration(newRefreshToken);

		// Optionally, you can check if the new tokens have valid expiration times
		if (accessTokenExpiration <= new Date()) {
			throw new ErrorHandler(500, "Failed to generate a valid access token");
		}
		if (refreshTokenExpiration <= new Date()) {
			throw new ErrorHandler(500, "Failed to generate a valid refresh token");
		}

		// Replace old refresh token with new one
		// await this.refreshTokenRepository.deleteByToken(refreshToken);
		await this.refreshTokenRepository.create({
			token: newRefreshToken,
			userId: user["id"]!,
			expiresAt: refreshTokenExpiration,
		});

		return {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
			payload
		};
	}
}


