import { ErrorHandler } from "api/error/ErrorHandler";
import { IFarmUseCase } from "application/modules/farm/interface/IFarmUseCase";
import { IFilesService, IInfosImage } from "infrastructure/services/FilesService";
import { ICentroideCalculatorService } from "./CentroideCalculator";
import { haversineDistance } from "./haversineDistance";

import { IFeedlotUseCase } from "application/modules/feedlot/interface/IFeedlotUseCase";
import { IImage4kUseCase } from "../interface/IimageUseCase";
import { OutputDTOListFeedlots } from "application/modules/feedlot/outputDTO/FeedlotOutputsDTOs";
import { Coordinate } from "core/valueObjects/coordinate";
import { Feedlot } from "core/entities/feedlot";

import { performance } from "perf_hooks";
import { State } from "core/enums/state";
import { Position } from "core/enums/position";
import { ICowUseCase } from "application/modules/cow/interface/IcowUseCase";
import { IInfosRequest } from "api/controllers/userController";
import { Farm } from "core/entities/farm";
import { IIAService } from "infrastructure/services/IAService";
import { StatusRequest } from "@prisma/client";
import { IMinioService } from "infrastructure/services/minio/MinioService";

export interface IPayloadSendQueue {
	bucketName: string;
	userId: string;
	farmId: string;
	subBucketName: string[];
}

export interface IUploadImagesUseCase {
	execute(
		bucketName: string,
		userId: string,
		farmId: string,
		subBucketName: string[]
	): Promise<any>;
}

export class UploadImagesUseCase implements IUploadImagesUseCase {
	private distanciaMaximaPermitidaBaiaFazenda: number = 5; // km
	private farm: Farm | null = null;
	private feedlot: Feedlot | null = null;

	constructor(
		private filesService: IFilesService,
		private feedlotUseCase: IFeedlotUseCase,
		private farmUseCase: IFarmUseCase,
		private image4kUseCase: IImage4kUseCase,
		private iaService: IIAService,
		private centroidCalculator: ICentroideCalculatorService,
		private cowUseCase: ICowUseCase,
		private minioService: IMinioService
	) {}


	async execute(
		bucketName: string,
		userId: string,
		farmId: string,
		subBucketName: string[]
	): Promise<any> {
		console.log("bucketName ", bucketName);
		console.log("userId ", userId);
		console.log("farmId ", farmId);
		console.log("subBucketName ", subBucketName);
		
		const farm = await this.farmUseCase.getFarmById({ id: farmId });
		if (!farm) throw new ErrorHandler(404, "Fazenda não encontrada para o usuário.");

		const payload: IPayloadSendQueue = {
			bucketName: bucketName,
			userId: userId,
			farmId: farm.id,
			farmName: farm.name,
			subBucketName: subBucketName,
		};

		await this.iaService.sendImagesForProcessing(payload);

		return {
			message: "Imagens sendo processadas, aguarde...",
			success: true,
		};
	}
}

