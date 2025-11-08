import { IAuthenticateUserUseCase } from "../interface/IAuthenticateUserUseCase";
import { ErrorHandler } from "api/error/ErrorHandler";
import { AuthTokens } from "core/entities/Auth";
import { IUserRepository } from "core/IRepositories/IUserRepository";
import { access } from "fs";
import { IRefreshTokenRepository } from "infrastructure/database/repository/RefreshTokenRepository";
import { IPasswordService } from "infrastructure/services/BcryptPasswordService";
import { ITokenService, JwtTokenPayload } from "infrastructure/services/JwtTokenService";

// Use Cases Implementation
export class AuthenticateUserUseCase implements IAuthenticateUserUseCase {
	constructor(
		private userRepository: IUserRepository,
		private refreshTokenRepository: IRefreshTokenRepository,
		private passwordService: IPasswordService,
		private tokenService: ITokenService
	) {}

	async execute(email: string, password: string): Promise<AuthTokens> {
		const user = await this.userRepository.getUserByEmail(email);
		if (!user) {
			throw new ErrorHandler(401, "Email not found");
		}

		const isValidPassword = await this.passwordService.compare(password, user.password!);
		if (!isValidPassword) {
			throw new ErrorHandler(401, "Invalid password");
		}

		// Remove existing refresh tokens for this user
		if (!user["id"]) {
			throw new ErrorHandler(500, "User ID is missing");
		}

		await this.refreshTokenRepository.deleteByUserId(user["id"]);

		const payload: JwtTokenPayload = {
			userId: user["id"],
			name: user["name"],
			email: user["email"],
			type: user["type"],
			access: user["access"],
			farmId: user["farmId"] || null,
		};

		const accessToken = this.tokenService.generateAccessToken(payload);

		const refreshToken = this.tokenService.generateRefreshToken(payload);



		await this.refreshTokenRepository.create({
			token: refreshToken,
			userId: user["id"],
			expiresAt: this.tokenService.getRefreshTokenExpiration(refreshToken),
		});


		return {
			accessToken,
			refreshToken,
			payload
		};
	}
}

