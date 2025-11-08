import express, { Router } from "express";
import "dotenv/config";
import cors from "cors";
import { UserController } from "./controllers/userController";
import { UserUseCase } from "../application/modules/user/useCase/UserUseCase";
import { UserRepository } from "infrastructure/database/repository/UserRepository";
import { InfraStructure } from "infrastructure/infraStructure";
import { UserRoutes } from "./routes/userRoutes";
import { handleError } from "./error/ErrorHandler";

// farm
import { BcryptPasswordService } from "infrastructure/services/BcryptPasswordService";
import { AuthMiddleware } from "./middleware/AuthMiddleware";
import { JwtTokenService } from "infrastructure/services/JwtTokenService";
import { RefreshTokenUseCase } from "application/modules/auth/useCase/RefreshTokenUseCase";
import { RevokeTokenUseCase } from "application/modules/auth/useCase/RevokeTokenUseCase";
import { AuthenticateUserUseCase } from "application/modules/auth/useCase/AuthenticateUserUseCase";
import { RefreshTokenRepository } from "infrastructure/database/repository/RefreshTokenRepository";
import { AuthRoutes } from "./routes/AuthRoutes";
import { AuthController } from "./controllers/AuthController";
import { LoggerFactory, loggingMiddleware } from "infrastructure/logger/logger";
import { FilesService } from "infrastructure/services/FilesService";

import cookieParser from "cookie-parser";

const client = InfraStructure.addBD();
const userRepository = new UserRepository(client);

const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret_key";
const port = process.env.SERVER_PORT || 8080;
const app = express();
const router = Router();


// auth imports --------------------------------------------------------------------------------------------
const passwordService = new BcryptPasswordService();
const tokenService = new JwtTokenService(jwtSecret);
const refreshTokenRepository = new RefreshTokenRepository(client);

const authenticateUserUseCase = new AuthenticateUserUseCase(
	userRepository,
	refreshTokenRepository,
	passwordService,
	tokenService
);

const refreshTokenUseCase = new RefreshTokenUseCase(
	userRepository,
	refreshTokenRepository,
	tokenService
);
const revokeTokenUseCase = new RevokeTokenUseCase(refreshTokenRepository);
const authMiddleware = new AuthMiddleware(tokenService);

const authController = new AuthController(
	authenticateUserUseCase,
	revokeTokenUseCase,
	refreshTokenUseCase,
	tokenService
);
new AuthRoutes(router, authController);

// --------------------------------------------------------------------------------------------------------------

// Logger
const logger = LoggerFactory.getInstance();
app.use(loggingMiddleware(logger));


//user
const userUseCase = new UserUseCase(userRepository, passwordService);
const filesService = new FilesService();
const userController = new UserController(userUseCase, logger, filesService);
new UserRoutes(router, userController, authMiddleware, filesService);


app.use(cookieParser());

app.use(
	cors({
		origin: "http://localhost:4200",
		credentials: true,
	})
);

app.use(express.json());
app.use(router);
app.use(handleError);


app.listen(port, () => {
	console.log(`🚀 Server is running on http://localhost:${port}`);
});



