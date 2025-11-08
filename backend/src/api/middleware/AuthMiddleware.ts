import { ErrorHandler } from "api/error/ErrorHandler";
import { NextFunction, Request, Response } from "express";
import { ITokenService, JwtTokenPayload } from "infrastructure/services/JwtTokenService";

import { JwtPayload } from "jsonwebtoken"; // ou o tipo que você usa no token

// Extend Express Request to include authUser
declare global {
  namespace Express {
	interface Request {
	  authUser?: any; // Replace 'any' with your payload type if available
	}
  }
}

// Auth Middleware
export class AuthMiddleware {
	constructor(private tokenService: ITokenService) {}

	public authenticate(req: Request, res: Response, next: NextFunction): void {
		try {
			const accessToken = req.cookies.accessToken;
			if (!accessToken) {
				res.status(401).json({ error: "Access token required" });
				return;
			}
			
			const payload: JwtPayload = this.tokenService.verifyAccessToken(accessToken);


			req.authUser = payload;
			next();
		} catch (error) {
			if (error instanceof ErrorHandler) {
				res.status(401).json({ error: "Token expired" });
				return;
			}
			if (error instanceof ErrorHandler) {
				res.status(401).json({ error: "Invalid token" });
				return;
			}
			res.status(401).json({ error: "Authentication failed :" + error });
		}
	};

	public authorize (role: string[]) {
		return (req: Request, res: Response, next: NextFunction): void => {
			if (!req.authUser) {
				res.status(401).json({ error: "Authentication required" });
				return;
			}

			if (!role.includes(req.authUser.type)) { 
				res.status(403).json({ error: "Insufficient permissions" });
				return;
			}

			next();
		};
	};
}
