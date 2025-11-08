import { ErrorHandler } from "api/error/ErrorHandler";
import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

export interface JwtTokenPayload extends JwtPayload {
	userId: string;
	name: string;
	email: string;
	type: string;
	access: string;
	farmId: string | null;
}

export interface ITokenService {
	generateAccessToken(payload: JwtTokenPayload): string;
	generateRefreshToken(payload: JwtTokenPayload): string;
	verifyAccessToken(token: string): JwtPayload;
	getAccessTokenExpiration(token: string): Date;
	getRefreshTokenExpiration(token: string): Date;
}

export class JwtTokenService implements ITokenService {
	constructor(
		private jwtSecret: string,
		private accessTokenExpiration: SignOptions["expiresIn"] = "1d",
		private refreshTokenExpiration: SignOptions["expiresIn"] = "5d"
	) {}

	generateAccessToken(payload: JwtTokenPayload): string {
		return jwt.sign(payload, this.jwtSecret, {
			expiresIn: this.accessTokenExpiration,
			algorithm: "HS256",
		});
	}

	generateRefreshToken(payload: JwtTokenPayload): string {
		return jwt.sign(payload, this.jwtSecret, {
			expiresIn: this.refreshTokenExpiration,
			algorithm: "HS256",
		});
	}

	verifyAccessToken(token: string): JwtPayload {
		try {
			const decodedToken: JwtPayload = jwt.verify(token, this.jwtSecret, {
				algorithms: ["HS256"],
			}) as JwtPayload;

			if (!decodedToken || typeof decodedToken === "string") {
				throw new ErrorHandler(401, "Invalid token");
			}

			// Ensure required fields are present
			if (
				!decodedToken.userId ||
				!decodedToken.name ||
				!decodedToken.email ||
				!decodedToken.type ||
				!decodedToken.access ||
				!("farmId" in decodedToken) // farmId can be null, so just check for its presence
			) {
				throw new ErrorHandler(401, "Invalid token payload");
			}

			return decodedToken;
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				throw new ErrorHandler(401, "Token expired");
			}
			throw new ErrorHandler(401, "Invalid token");
		}
	}

	getAccessTokenExpiration(token: string): Date {
		const decoded = jwt.decode(token) as JwtPayload;

		if (!decoded || !decoded.exp) {
			throw new ErrorHandler(401, "Invalid access token");
		}

		return new Date(decoded.exp * 1000);
	}

	getRefreshTokenExpiration(token: string): Date {
		const decoded = jwt.decode(token) as JwtPayload;

		if (!decoded || !decoded.exp) {
			throw new ErrorHandler(401, "Invalid refresh token");
		}

		return new Date(decoded.exp * 1000);
	}
}

