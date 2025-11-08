// src/application/modules/feedlot/controllers/feedlotController.ts
import { Request, Response } from "express";
import { FeedlotUseCase } from "../../application/modules/feedlot/useCase/FeedlotUseCase";
import { ILogger } from "infrastructure/logger/logger";

export class FeedlotController {
	constructor(
		private feedlotUseCase: FeedlotUseCase,
		private logger: ILogger
	) {}

	async getAllFeedlots(req: Request, res: Response): Promise<void> {
		try {
			this.logger.info("[FeedlotController] getAllFeedlots chamado");
			const response = await this.feedlotUseCase.getAllFeedlots();
			res.status(200).send(response);
		} catch (error: any) {
			this.logger.error("[FeedlotController] Erro em getAllFeedlots", error);
			res.status(500).send({ message: error.message || error });
		}
	}

	async createFeedlot(req: Request, res: Response): Promise<void> {
		try {
			const body = req.body;
			this.logger.info("[FeedlotController] createFeedlot chamado", body);
			const response = await this.feedlotUseCase.createFeedlot(body);
			res.status(201).send(response);
		} catch (error: any) {
			this.logger.error("[FeedlotController] Erro em createFeedlot", error);
			res.status(500).send({ message: error.message || error });
		}
	}

	async updateFeedlot(req: Request, res: Response): Promise<void> {
		try {
			const body = req.body;
			this.logger.info("[FeedlotController] updateFeedlot chamado", body);
			const response = await this.feedlotUseCase.updateFeedlot(body);
			res.status(200).send(response);
		} catch (error: any) {
			this.logger.error("[FeedlotController] Erro em updateFeedlot", error);
			res.status(500).send({ message: error.message || error });
		}
	}

	async deleteFeedlot(req: Request, res: Response): Promise<void> {
		try {
			const body = req.params;
			this.logger.info("[FeedlotController] deleteFeedlot chamado", body);
			const response = await this.feedlotUseCase.deleteFeedlot({ id: body.id });
			res.status(200).send(response);
		} catch (error: any) {
			this.logger.error("[FeedlotController] Erro em deleteFeedlot", error);
			res.status(500).send({ message: error.message || error });
		}
	}

	async getFeedlotById(req: Request, res: Response): Promise<void> {
		try {
			const id = req.params.id;
			this.logger.info("[FeedlotController] getFeedlotById chamado", { id });
			const response = await this.feedlotUseCase.getFeedlotById({ id });
			res.status(200).send(response);
		} catch (error: any) {
			this.logger.error("[FeedlotController] Erro em getFeedlotById", error);
			res.status(500).send({ message: error.message || error });
		}
	}
}

