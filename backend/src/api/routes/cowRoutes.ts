// src/application/modules/cow/routes/CowRoutes.ts
import { Router, Request, Response, NextFunction } from "express";
import { CowController } from "../controllers/cowController";
import { AuthMiddleware } from "api/middleware/AuthMiddleware";

export class CowRoutes {
	private basePath: string = "/cow";
	private cowRoutes: Router = Router();
	private permitedAdminAndDev: string[] = ["dev", "admin"];

	constructor(
		private routerBase: Router,
		private cowController: CowController,
		private authMiddleware: AuthMiddleware
	) {
		this.initializeRoutes();
		this.routerBase.use(this.basePath, this.cowRoutes);
	}

	private initializeRoutes(): void {
		// GET all cows
		this.cowRoutes.get(
			"/getAll",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.cowController.getAllCows(req, res);
			}
		);

		// GET cow by ID
		this.cowRoutes.get(
			"/getById/:id",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.cowController.getCowById(req, res);
			}
		);

		// POST create cow
		this.cowRoutes.post(
			"/create",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.cowController.createCow(req, res);
			}
		);

		// PUT update cow
		this.cowRoutes.put(
			"/update",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.cowController.updateCow(req, res);
			}
		);

		// DELETE cow
		this.cowRoutes.delete(
			"/delete/:id",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.cowController.deleteCow(req, res);
			}
		);


		this.cowRoutes.get(
			"/getImages/:farm/:folder/:user",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.cowController.getImagesFromRequest(req, res);
			}
		);


		this.cowRoutes.get(
			"/getHistorico/:userId/:farmId",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.cowController.getHistorico(req, res);
			}
		);
	}
}

