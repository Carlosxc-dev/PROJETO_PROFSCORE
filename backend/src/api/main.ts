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
import { FarmController } from "./controllers/farmController";
import { FarmUseCase } from "../application/modules/farm/useCase/FarmUseCase";
import { FarmRepository } from "infrastructure/database/repository/FarmRepository";
import { FarmRoutes } from "./routes/farmRoutes";
import { FeedlotRepository } from "infrastructure/database/repository/FeedlotRepository";
import { FeedlotUseCase } from "application/modules/feedlot/useCase/FeedlotUseCase";
import { FeedlotController } from "./controllers/feedlotController";
import { FeedlotRoutes } from "./routes/feedlotRoutes";
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
import { Images4kRepository } from "infrastructure/database/repository/Image4kRepository";
import { Image4kUseCase } from "application/modules/image4k/useCase/Image4kUseCase";
import { Image4kController } from "./controllers/images4kController";
import { Image4kRoutes } from "./routes/image4kRoutes";
import { CowRepository } from "infrastructure/database/repository/CowRepository";
import { CowUseCase } from "application/modules/cow/useCase/cowUseCase";
import { CowController } from "./controllers/cowController";
import { CowRoutes } from "./routes/cowRoutes";
import { IAService } from "infrastructure/services/IAService";
import { FilesService } from "infrastructure/services/FilesService";
import { UploadImagesUseCase } from "application/modules/image4k/useCase/UploadImagesUseCase";
import { CentroideCalculatorService } from "application/modules/image4k/useCase/CentroideCalculator";

import cookieParser from "cookie-parser";
import { GetImagesFromRequestUseCase } from "application/modules/cow/useCase/getImagesFromRequestUseCase";

import { RabbitConsumer } from "./../infrastructure/services/rabbit/consumerRabbit";
import { MinioService } from "infrastructure/services/minio/MinioService";
import { MinioImages4KUseCase } from "application/modules/image4k/useCase/minio-images4K-useCase";
import { WebSocketService } from "infrastructure/services/websocket/webSocketService";

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


const iaService = new IAService();
const minioService = new MinioService();
const image4kRepository = new Images4kRepository(client);

//user
const userUseCase = new UserUseCase(userRepository, passwordService);
const centroideCalculatorService = new CentroideCalculatorService();
const filesService = new FilesService();
const userController = new UserController(userUseCase, logger, filesService);
new UserRoutes(router, userController, authMiddleware, filesService);

//farm
const farmRepository = new FarmRepository(client);
const farmUseCase = new FarmUseCase(farmRepository, userRepository);
const farmController = new FarmController(farmUseCase, logger);
new FarmRoutes(router, farmController, authMiddleware);

//feedlot
const feedlotRepository = new FeedlotRepository(client);
const feedlotUseCase = new FeedlotUseCase(feedlotRepository, farmRepository);
const feedlotController = new FeedlotController(feedlotUseCase, logger);
new FeedlotRoutes(router, feedlotController, authMiddleware);

// cows
const cowRepository = new CowRepository(client);
const cowsUseCase = new CowUseCase(cowRepository, feedlotRepository);
const getImagesFromRequestUseCase = new GetImagesFromRequestUseCase(
	cowRepository,
	image4kRepository
);
const cowsController = new CowController(cowsUseCase, getImagesFromRequestUseCase, logger);
new CowRoutes(router, cowsController, authMiddleware);

// images4k
const image4kUseCase = new Image4kUseCase(image4kRepository, feedlotRepository);
const minioImages4KUseCase = new MinioImages4KUseCase(
	feedlotUseCase,
	farmUseCase,
	image4kUseCase,
	iaService,
	minioService
);

const uploadImagesUseCase = new UploadImagesUseCase(
	filesService,
	feedlotUseCase,
	farmUseCase,
	image4kUseCase,
	iaService,
	centroideCalculatorService,
	cowsUseCase,
	minioService
);
const image4kController = new Image4kController(image4kUseCase, logger, minioImages4KUseCase, uploadImagesUseCase);
new Image4kRoutes(router, image4kController, authMiddleware);


// websocket
const websocket = new WebSocketService(9090, getImagesFromRequestUseCase);


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

// 🚀 Deixa a pasta "uploads" pública
app.use("/getImages", express.static("uploads"));

// Inicia o consumidor RabbitMQ

async function startServerRabbit() {
	const consumer = new RabbitConsumer(filesService, cowsUseCase, image4kUseCase, websocket, minioService);
	await consumer.start();
	console.log("🚀 Consumer de IA iniciado e aguardando mensagens...");
}

startServerRabbit();



app.listen(port, () => {
	console.log(`🚀 Server is running on http://localhost:${port}`);
});



