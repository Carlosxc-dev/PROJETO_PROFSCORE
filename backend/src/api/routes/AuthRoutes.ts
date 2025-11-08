import { AuthController } from "api/controllers/AuthController";
import { Router, Request, Response, NextFunction } from "express";

export class AuthRoutes {
    private basePath: string = "/auth";
    private authRoutes: Router = Router();

    constructor(
        private routerBase: Router,
        private authController: AuthController
    ) {
        this.initializeRoutes();
        routerBase.use(this.basePath, this.authRoutes);
    }

    private initializeRoutes(): void {
        this.authRoutes.post(
            "/login",
            (req: Request, res: Response, next: NextFunction) => {
                return this.authController.signin(req, res, next);
            }
        );

        this.authRoutes.post(
            "/logout",
            (req: Request, res: Response, next: NextFunction) => {
                return this.authController.logout(req, res, next);
            }
        );

        this.authRoutes.post(
            "/refresh-token",
            (req: Request, res: Response, next: NextFunction) => {
                return this.authController.refreshToken(req, res, next);
            }
        );

        this.authRoutes.get(
            "/validate",
            (req: Request, res: Response, next: NextFunction) => {
                return this.authController.validate(req, res, next);
            }
        );
    }
}
