import { Router, Request, Response, NextFunction } from "express";
import { FeedlotController } from "../controllers/feedlotController";
import { AuthMiddleware } from "api/middleware/AuthMiddleware";

export class FeedlotRoutes {
	private basePath: string = "/feedlot";
	private feedlotRoutes: Router = Router();
	private permitedAdminAndDev: string[] = ["dev", "admin"];

	constructor(
		private routerBase: Router,
		private feedlotController: FeedlotController,
		private authMiddleware: AuthMiddleware
	) {
		this.initializeRoutes();
		this.routerBase.use(this.basePath, this.feedlotRoutes);
	}

	private initializeRoutes(): void {
		this.feedlotRoutes.get(
			"/getAll",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.feedlotController.getAllFeedlots(req, res);
			}
		);

		this.feedlotRoutes.post(
			"/create",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.feedlotController.createFeedlot(req, res);
			}
		);

		this.feedlotRoutes.put(
			"/update",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.feedlotController.updateFeedlot(req, res);
			}
		);

		this.feedlotRoutes.delete(
			"/delete/:id",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.feedlotController.deleteFeedlot(req, res);
			}
		);

		this.feedlotRoutes.get(
			"/getById/:id",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.feedlotController.getFeedlotById(req, res);
			}
		);
	}
}

