// src/application/modules/feedlot/controllers/feedlotController.ts
import { NextFunction, Request, Response } from "express";
import { Image4kUseCase } from "application/modules/image4k/useCase/Image4kUseCase";
import { ILogger } from "infrastructure/logger/logger";
import { InputDTOCreateImage4k } from "application/modules/image4k/inputDTO/Image4kInputDTOs";
import {
	createImage4KSchema,
	deleteImage4KSchema,
	getImage4KByIdSchema,
	updateImage4KSchema,
} from "api/validators/Image4KValidators";
import { IMinioImages4KUseCase } from "application/modules/image4k/useCase/minio-images4K-useCase";
import { th } from "zod/v4/locales";
import { IUploadImagesUseCase } from "application/modules/image4k/useCase/UploadImagesUseCase";

export class Image4kController {
	constructor(
		private image4kUseCase: Image4kUseCase,
		private logger: ILogger,
		private minioImages4KUseCase: IMinioImages4KUseCase,
		private uploadImagesUseCase: IUploadImagesUseCase
	) {}

	async getAllFegetAllimage4ksedlots(req: Request, res: Response): Promise<void> {
		try {
			this.logger.info("[Image4kController] Buscando todas as imagens 4K");
			const response = await this.image4kUseCase.getAllimage4ks();
			res.status(200).json(response);
		} catch (error: any) {
			this.logger.error("Erro ao buscar imagens 4K", error);
			res.status(500).json({ message: error.message || error });
		}
	}

	async createImage4k(req: Request, res: Response): Promise<void> {
		try {
			const validatedBody = createImage4KSchema.parse(req.body);
			this.logger.info("[Image4kController] Criando nova imagem 4K", validatedBody);
			const response = await this.image4kUseCase.createImage4k(validatedBody);
			res.status(200).json(response);
		} catch (error: any) {
			this.logger.error("Erro ao criar imagem 4K", error);
			res.status(500).json({ message: error.message || error });
		}
	}

	async updateImage4k(req: Request, res: Response): Promise<void> {
		try {
			const validatedBody = updateImage4KSchema.parse(req.body); // validação
			const response = await this.image4kUseCase.updateImage4k(validatedBody);
			this.logger.info("Imagem 4K atualizada com sucesso", response);
			res.status(200).json(response);
		} catch (error: any) {
			this.logger.error("Erro ao atualizar imagem 4K", error);
			res.status(500).json({ message: error.message || error });
		}
	}

	async deleteImage4k(req: Request, res: Response): Promise<void> {
		try {
			const validatedBody = deleteImage4KSchema.parse(req.params); // validação
			const response = await this.image4kUseCase.deleteImage4k(validatedBody);
			this.logger.info("Imagem 4K deletada com sucesso", response);
			res.status(200).json(response);
		} catch (error: any) {
			this.logger.error("Erro ao deletar imagem 4K", error);
			res.status(500).json({ message: error.message || error });
		}
	}

	async getImage4kById(req: Request, res: Response): Promise<void> {
		try {
			const validatedBody = getImage4KByIdSchema.parse(req.params); // validação
			const response = await this.image4kUseCase.getImage4kById(validatedBody);
			this.logger.info("Imagem 4K encontrada", response);
			res.status(200).json(response);
		} catch (error: any) {
			this.logger.error("Erro ao buscar imagem 4K por ID", error);
			res.status(500).json({ message: error.message || error });
		}
	}

	async uploadImages(req: Request, res: Response, next: NextFunction): Promise<any> {
		try {
			const { bucketName, subBucketName } = req.body;
			const userId = req.authUser?.userId;
			const farmId = req.authUser?.farmId;
			if (!userId) return res.status(401).json({ message: "User not authenticated" });
			if (!farmId) return res.status(400).json({ message: "Farm ID not found for the user" });

			const response = await this.uploadImagesUseCase.execute(
				bucketName,
				userId,
				farmId,
				subBucketName
			);
			return res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	async getUrlFromMinIo(req: Request, res: Response): Promise<void> {
		try {
			const { fileNames, bucketName, subBucketName } = req.body;
			const userId = req.authUser?.userId;
			const farmId = req.authUser?.farmId;
			const response = await this.minioImages4KUseCase.getUrlFromMinIo(
				fileNames,
				bucketName,
				subBucketName
			);

			res.status(200).json(response);
		} catch (error: any) {
			this.logger.error("Erro ao gerar URL do MinIO", error);
			res.status(500).json({ message: error.message || error });
		}
	}

	async deleteAllBuckets(req: Request, res: Response): Promise<void> {
		try {
			await this.minioImages4KUseCase.deleteAllBuckets();
			res.status(200).json({ message: "Todos os buckets foram deletados com sucesso" });
		} catch (error: any) {
			res.status(500).json({ message: error.message || error });
		}
	}

	async createBucketIfNotExists(req: Request, res: Response): Promise<void> {
		try {
			const { bucketName } = req.body;
			const response = await this.minioImages4KUseCase.createBucketIfNotExists(bucketName);
			res.status(200).json(response);
		} catch (error: any) {
			this.logger.error("Erro ao criar bucket no MinIO", error);
			res.status(500).json({ message: error.message || error });
		}
	}
}

