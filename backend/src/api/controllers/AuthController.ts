import { loginSchema } from "api/validators/authValidatorSchema";
import { IAuthenticateUserUseCase } from "application/modules/auth/interface/IAuthenticateUserUseCase";
import { IRefreshTokenUseCase } from "application/modules/auth/interface/IRefreshTokenUseCase";
import { IRevokeTokenUseCase } from "application/modules/auth/interface/IRevokeTokenUseCase";
import { NextFunction, Request, Response } from "express";
import { ITokenService } from "infrastructure/services/JwtTokenService";

export class AuthController {
	constructor(
		private authenticateUserUseCase: IAuthenticateUserUseCase,
		private revokeTokenUseCase: IRevokeTokenUseCase,
		private refreshTokenUseCase: IRefreshTokenUseCase,
		private tokenService: ITokenService,

	) {}

	public async signin(req: Request, res: Response, next: NextFunction) {
		try {
			const validateLogin = loginSchema.parse(req.body);
			
			const tokens = await this.authenticateUserUseCase.execute(
				validateLogin.email,
				validateLogin.password
			);

			const accessTokenExpiration = this.tokenService.getAccessTokenExpiration(tokens.accessToken).getTime();
			const refreshTokenExpiration = this.tokenService.getRefreshTokenExpiration(tokens.refreshToken).getTime();

			// Define ambos os tokens como HttpOnly cookies
			res.status(200)
				.cookie("accessToken", tokens.accessToken, {
					httpOnly: true,
					secure: true,
					sameSite: "strict",
					maxAge: accessTokenExpiration
				})
				.cookie("refreshToken", tokens.refreshToken, {
					httpOnly: true,
					secure: true,
					sameSite: "strict",
					maxAge: refreshTokenExpiration
				})
				.json({
					message: "User authenticated successfully",
					user: {
						// Retorna apenas dados não sensíveis do usuário
						id: tokens.payload.userId,
						name: tokens.payload.name,
						email: tokens.payload.email,
						type: tokens.payload.type,
						access: tokens.payload.access,
						farmId: tokens.payload.farmId
					},
					// accessToken: tokens.accessToken, --- IGNORE ---
					// refreshToken: tokens.refreshToken, --- IGNORE ---
				});
		} catch (error) {
			next(error);
		}
	}

	public async logout(req: Request, res: Response, next: NextFunction) {
		try {
			// Extrai o refreshToken do cookie (não do body!)
			const refreshToken = req.cookies.refreshToken;

			if (refreshToken) {
				await this.revokeTokenUseCase.execute(refreshToken);
			}

			// Limpa os cookies
			res.status(200)
				.clearCookie("accessToken")
				.clearCookie("refreshToken")
				.json({ message: "Logged out successfully" });
		} catch (error) {
			next(error);
		}
	}

	public async refreshToken(req: Request, res: Response, next: NextFunction) {
		try {
			const refreshToken = req.cookies.refreshToken;
			if (!refreshToken) {
				res.status(401).json({ error: "Refresh token not found" });
				return;
			}

			// Implementa Refresh Token Rotation
			const tokens = await this.refreshTokenUseCase.execute(refreshToken);

			// Invalida o refreshToken antigo
			await this.revokeTokenUseCase.execute(refreshToken);

			const accessTokenExpiration = this.tokenService.getAccessTokenExpiration(tokens.accessToken).getTime();
			const refreshTokenExpiration = this.tokenService.getRefreshTokenExpiration(tokens.refreshToken).getTime();

			// Define novos tokens como cookies
			res.status(200)
				.cookie("accessToken", tokens.accessToken, {
					httpOnly: true,
					secure: true,
					sameSite: "strict",
					maxAge: accessTokenExpiration
				})
				.cookie("refreshToken", tokens.refreshToken, {
					httpOnly: true,
					secure: true,
					sameSite: "strict",
					maxAge: refreshTokenExpiration
				})
				.json({
					message: "Token refreshed successfully",
				});
		} catch (error) {
			next(error);
		}
	}

	// No AuthController, adicione:
	public async validate(req: Request, res: Response, next: NextFunction) {
		try {
			const accessToken = req.cookies.accessToken;

			if (!accessToken) {
				res.status(401).json({ authenticated: false });
				return;
			}

			// Valida o token (implementar lógica de validação)
			const token = await this.tokenService.verifyAccessToken(accessToken);

			if (!token) res.status(401).json({ authenticated: false });

			res.status(200).json({
				authenticated: true,
			});
		} catch (error) {
			res.status(401).json({ authenticated: false });
		}
	}
}



