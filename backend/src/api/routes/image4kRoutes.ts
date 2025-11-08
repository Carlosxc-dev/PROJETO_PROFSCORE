// src/application/modules/image4k/routes/Image4kRoutes.ts
import { Router, Request, Response, NextFunction } from "express";
import { Image4kController } from "../controllers/images4kController.ts";
import { AuthMiddleware } from "api/middleware/AuthMiddleware.ts";
import { IMinioImages4KUseCase } from "application/modules/image4k/useCase/minio-images4K-useCase.ts";

export class Image4kRoutes {
	private basePath: string = "/image4k";
	private image4kRoutes: Router = Router();
	private permitedAdminAndDev: string[] = ["dev", "admin"];

	constructor(
		private routerBase: Router,
		private image4kController: Image4kController,
		private authMiddleware: AuthMiddleware,
	) {
		this.initializeRoutes();
		this.routerBase.use(this.basePath, this.image4kRoutes);
	}

	private initializeRoutes(): void {
		// GET all images
		this.image4kRoutes.get(
			"/getAll",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.image4kController.getAllFegetAllimage4ksedlots(req, res);
			}
		);

		// GET image by ID
		this.image4kRoutes.get(
			"/getById/:id",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.image4kController.getImage4kById(req, res);
			}
		);

		// POST create image
		this.image4kRoutes.post(
			"/create",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.image4kController.createImage4k(req, res);
			}
		);

		// PUT update image
		this.image4kRoutes.put(
			"/update",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.image4kController.updateImage4k(req, res);
			}
		);

		// DELETE image
		this.image4kRoutes.delete(
			"/delete/:id",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			(req: Request, res: Response, next: NextFunction) => {
				return this.image4kController.deleteImage4k(req, res);
			}
		);

		this.image4kRoutes.post(
			"/uploadImages",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			async (req: Request, res: Response, next: NextFunction) => {
				try {
					return this.image4kController.uploadImages(req, res, next);
				} catch (err) {
					next(err);
				}
			}
		);


		this.image4kRoutes.post(
			"/getUrlFromMinIo",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			async (req: Request, res: Response, next: NextFunction) => {
				try {
					return this.image4kController.getUrlFromMinIo(req, res);
				} catch (err) {
					next(err);
				}
			}
		);

		this.image4kRoutes.delete(
			"/deleteAllBuckets",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			async (req: Request, res: Response, next: NextFunction) => {
				try {
					return this.image4kController.deleteAllBuckets(req, res);
				} catch (err) {
					next(err);
				}
			}
		);

		this.image4kRoutes.post(
			"/createBucketIfNotExists",
			this.authMiddleware.authenticate.bind(this.authMiddleware),
			this.authMiddleware.authorize(this.permitedAdminAndDev),
			async (req: Request, res: Response, next: NextFunction) => {
				try {
					return this.image4kController.createBucketIfNotExists(req, res);
				} catch (err) {
					next(err);
				}
			}
		);
	}
}

