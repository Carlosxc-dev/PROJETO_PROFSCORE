// src/application/modules/cow/controllers/cowController.ts
import { Request, Response } from "express";
import { CowUseCase } from "../../application/modules/cow/useCase/cowUseCase";
import { ILogger } from "infrastructure/logger/logger";
import {
	createCowSchema,
	updateCowSchema,
	deleteCowSchema,
	getCowByIdSchema,
} from "../validators/cowValidatorsSchema";
import { InputDTOUpdateCow } from "application/modules/cow/inputDTO/cowInputDTOs";
import { GetImagesFromRequestUseCase } from "application/modules/cow/useCase/getImagesFromRequestUseCase";

export class CowController {
	constructor(
		private cowUseCase: CowUseCase,
		private getImagesFromRequestUseCase: GetImagesFromRequestUseCase,
		private logger: ILogger
	) {}

	async getAllCows(req: Request, res: Response): Promise<void> {
		try {
			this.logger.info("[CowController] getAllCows chamado");
			const response = await this.cowUseCase.getAllCows();
			res.status(200).json(response);
		} catch (error: any) {
			this.logger.error("[CowController] Erro em getAllCows", error);
			res.status(500).json({ message: error.message || error });
		}
	}

	async createCow(req: Request, res: Response): Promise<void> {
		try {
			this.logger.info("[CowController] createCow chamado", req.body);

			const validatedBody = createCowSchema.parse(req.body);
			const response = await this.cowUseCase.createCow(validatedBody);

			res.status(201).json(response);
		} catch (error: any) {
			this.logger.error("[CowController] Erro em createCow", error);
			res.status(400).json({ message: error.message || error });
		}
	}

	async updateCow(req: Request, res: Response): Promise<void> {
		try {
			this.logger.info("[CowController] updateCow chamado", req.body);

			const validatedBody = updateCowSchema.parse(req.body);
			if (!validatedBody.state) throw new Error("State é obrigatório");
			if (!validatedBody.position) throw new Error("Position é obrigatório");
			const response = await this.cowUseCase.updateCow(validatedBody as InputDTOUpdateCow);

			res.status(200).json(response);
		} catch (error: any) {
			this.logger.error("[CowController] Erro em updateCow", error);
			res.status(400).json({ message: error.message || error });
		}
	}

	async deleteCow(req: Request, res: Response): Promise<void> {
		try {
			this.logger.info("[CowController] deleteCow chamado", req.params);

			const validatedBody = deleteCowSchema.parse(req.params);
			const response = await this.cowUseCase.deleteCow(validatedBody);

			res.status(200).json(response);
		} catch (error: any) {
			this.logger.error("[CowController] Erro em deleteCow", error);
			res.status(400).json({ message: error.message || error });
		}
	}

	async getCowById(req: Request, res: Response): Promise<void> {
		try {
			const idObj = { id: req.params.id };
			this.logger.info("[CowController] getCowById chamado", idObj);

			const validatedParams = getCowByIdSchema.parse(idObj);
			const response = await this.cowUseCase.getCowById(validatedParams);

			res.status(200).json(response);
		} catch (error: any) {
			this.logger.error("[CowController] Erro em getCowById", error);
			res.status(400).json({ message: error.message || error });
		}
	}

	async getImagesFromRequest(req: Request, res: Response): Promise<void> {
		try {
			const { farm, folder, user } = req.params;
			const response = await this.getImagesFromRequestUseCase.execute(folder, farm, user);
			res.status(200).json(response);
		} catch (error: any) {
			this.logger.error("[CowController] Erro em getImagesFromRequest", error);
			res.status(400).json({ message: error.message || error });
		}
	}

	async getHistorico(req: Request, res: Response): Promise<void> {
		try {
			const {userId, farmId} = req.params;
			const response = await this.getImagesFromRequestUseCase.getHistorico(userId, farmId);
			res.status(200).json(response);
		} catch (error: any) {
			this.logger.error("[CowController] Erro em getImagesFromRequest", error);
			res.status(400).json({ message: error.message || error });
		}
	}
}

