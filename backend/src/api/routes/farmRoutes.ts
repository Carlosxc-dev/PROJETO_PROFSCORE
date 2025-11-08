import { Router, Request, Response, NextFunction } from "express";
import { FarmController } from "../controllers/farmController";
import { AuthMiddleware } from "api/middleware/AuthMiddleware";

export class FarmRoutes {
	private basePath: string = "/farm";
	private farmRoutes: Router = Router();
	private permitedAdminAndDev: string[] = ["dev", "admin"];

	constructor(
		private routerBase: Router,
		private farmController: FarmController,
		private authMiddleware: AuthMiddleware
	) {
		this.initializeRoutes();
		this.routerBase.use(this.basePath, this.farmRoutes);
	}

	private initializeRoutes(): void {
		this.farmRoutes.get(
			"/getAll",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.farmController.getAllFarms(req, res);
			}
		);

		this.farmRoutes.post(
			"/create",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.farmController.createFarm(req, res);
			}
		);

		this.farmRoutes.put(
			"/update",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.farmController.updateFarm(req, res);
			}
		);

		this.farmRoutes.delete(
			"/delete/:id",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.farmController.deleteFarm(req, res);
			}
		);

		this.farmRoutes.get(
			"/getById/:id",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.farmController.getFarmById(req, res);
			}
		);
	}
}

