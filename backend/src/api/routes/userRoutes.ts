import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/userController";
import { AuthMiddleware } from "api/middleware/AuthMiddleware";
import { IFilesService } from "infrastructure/services/FilesService";

export class UserRoutes {
	private basePath: string = "/user";
	private useRoutes: Router = Router();
	private upload: any;
	private permitedAdminAndDev: string[] = ["dev", "admin"];

	constructor(
		private routerBase: Router,
		private userController: UserController,
		private authMiddleware: AuthMiddleware,
		private filesService: IFilesService
	) {
		this.initializeRoutes();
		this.routerBase.use(this.basePath, this.useRoutes);
	}

	private initializeRoutes(): void {
		this.useRoutes.get(
			"/getAll",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.userController.getAllUser(req, res, next);
			}
		);

		this.useRoutes.get(
			"/getById/:id",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.userController.getUserById(req, res, next);
			}
		);

		this.useRoutes.post(
			"/create",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.userController.createUser(req, res, next);
			}
		);

		this.useRoutes.put(
			"/update",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.userController.updateUser(req, res, next);
			}
		);

		this.useRoutes.delete(
			"/delete/:id",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.userController.deleteUser(req, res, next);
			}
		);

		// this.useRoutes.post(
		// 	"/upload-images",
		// 	this.authMiddleware.authenticate.bind(this.authMiddleware),
		// 	this.authMiddleware.authorize(this.permitedAdminAndDev),
		// 	async (req: Request, res: Response, next: NextFunction) => {
		// 		try {
		// 			const multerInstance = await this.filesService.getFilesFromRoutes();
		// 			const upload = multerInstance.array("images", 50);

		// 			upload(req, res, async (err: any) => {
		// 				if (err) return next(err);
		// 				try {
		// 					await this.userController.uploadImages(req, res, next);
		// 				} catch (error) {
		// 					next(error);
		// 				}
		// 			});
		// 		} catch (err) {
		// 			next(err);
		// 		}
		// 	}
		// );
	}
}

