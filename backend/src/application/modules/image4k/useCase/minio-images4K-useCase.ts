import { IFarmUseCase } from "application/modules/farm/interface/IFarmUseCase";
import { IFilesService } from "infrastructure/services/FilesService";
import { ICentroideCalculatorService } from "./CentroideCalculator";

import { IFeedlotUseCase } from "application/modules/feedlot/interface/IFeedlotUseCase";
import { IImage4kUseCase } from "../interface/IimageUseCase";
import { Feedlot } from "core/entities/feedlot";

import { ICowUseCase } from "application/modules/cow/interface/IcowUseCase";
import { Farm } from "core/entities/farm";
import { IIAService } from "infrastructure/services/IAService";
import { IMinioService } from "infrastructure/services/minio/MinioService";
import { is } from "zod/v4/locales";

export interface IBuffers {
	originalname: string;
	mimetype: string;
	buffer: Buffer;
}

export interface ResponseUrls {
	urls: string[];
	bucketName: string;
}

export interface IMinioImages4KUseCase {
	getUrlFromMinIo(
		fileNames: string[],
		bucketName: string,
		subBucketName: string
	): Promise<ResponseUrls>;

	deleteAllBuckets(): Promise<void>;
	createBucketIfNotExists(bucketName: string): Promise<{ menssage: string; isCreated: boolean }>;
}

export class MinioImages4KUseCase implements IMinioImages4KUseCase {
	private farm: Farm | null = null;
	private feedlot: Feedlot | null = null;

	constructor(
		private feedlotUseCase: IFeedlotUseCase,
		private farmUseCase: IFarmUseCase,
		private image4kUseCase: IImage4kUseCase,
		private iaService: IIAService,
		private minioService: IMinioService
	) {}

	async getUrlFromMinIo(
		fileNames: string[],
		bucketName: string,
		subBucketName: string
	): Promise<ResponseUrls> {
		if (!fileNames || fileNames.length === 0) {
			throw new Error("Nenhum nome de arquivo fornecido.");
		}

		if (!bucketName || !subBucketName) {
			throw new Error("Nome do bucket ou sub-bucket não fornecido.");
		}
		
		const alredyExists = await this.minioService.isBucketExists(bucketName);
		if (!alredyExists) {
			await this.minioService.createBucket(bucketName);
			await this.minioService.makeBucketPublic(bucketName);
		}

		const urlsTemp = fileNames.map(async (fileName) => {
			const name = `${subBucketName}/${fileName}`;
			return await this.minioService.getPresignedUrl(bucketName, name);
		});

		const urls = await Promise.all(urlsTemp);

		return { bucketName, urls };
	}

	async deleteAllBuckets(): Promise<void> {
		await this.minioService.deleteAllBuckets();
	}	
	
	async createBucketIfNotExists(bucketName: string): Promise<{ menssage: string; isCreated: boolean }> {
		const response = {
			menssage: "Bucket já existe",
			isCreated: false
		}
		const exists = await this.minioService.isBucketExists(bucketName);
		if (!exists) return response

		const isCreated = await this.minioService.createBucket(bucketName);
		response.menssage = "Bucket criado com sucesso";
		response.isCreated = isCreated;
		return response;
	}
}
