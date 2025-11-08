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

export interface IBuffers {
	originalname: string;
	mimetype: string;
	buffer: Buffer;
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

	getCoordinatesFromImages(buffers: IBuffers[]): IInfosImage[] {
		return buffers.map((file) => {
			const coord = this.filesService.getLongLatFromBuffer(file.buffer);
			if (!coord) throw new ErrorHandler(400, `Imagem sem coordenadas: ${file.originalname}`);
			return coord;
		});
	}

	getFeedlotFromList(feedlotList: Feedlot[], centroide: Coordinate): Feedlot {
		let nearestFeedlot = null;
		let distanciaMaximaPermitidaBaiaCentroide = this.distanciaMaximaPermitidaBaiaFazenda;

		feedlotList.forEach((feedlot) => {
			const distance: number = haversineDistance(
				centroide.latitude,
				centroide.longitude,
				feedlot.coordinate.latitude,
				feedlot.coordinate.longitude
			);

			if (distance < distanciaMaximaPermitidaBaiaCentroide) {
				distanciaMaximaPermitidaBaiaCentroide = distance;
				nearestFeedlot = feedlot;
			}
		});

		if (!nearestFeedlot) throw new ErrorHandler(404, "Nenhuma baia perto da fazenda.");
		return nearestFeedlot;
	}

	verifyDistanceFeedlotToFarm(): boolean {
		if (!this.farm) {
			throw new ErrorHandler(500, "Farm não está definida.");
		}

		if (!this.feedlot) {
			throw new ErrorHandler(500, "Feedlot não está definida.");
		}
		const distanceFeedlotToFarm = haversineDistance(
			this.farm.coordinates.latitude,
			this.farm.coordinates.longitude,
			this.feedlot.coordinate.latitude,
			this.feedlot.coordinate.longitude
		);

		if (distanceFeedlotToFarm > this.distanciaMaximaPermitidaBaiaFazenda) return false;
		return true;
	}

	saveMetadadosImages4kResponseIA(
		centroide: Coordinate,
		totalImagesRequest: number,
		idFolder: string,
		userId: string,
		statusRequest: StatusRequest
	) {
		this.image4kUseCase.createImage4k({
			idFolder: idFolder,
			coordinates: {
				latitude: centroide.latitude,
				longitude: centroide.longitude,
			},
			totalImagesRequest: totalImagesRequest,
			feedlotId: this.feedlot?.id ?? "",
			userId: userId,
			statusRequest: statusRequest,
		});
	}

	saveCowsResponseIA(
		root_folder_id: string,
		files: { [fileName: string]: Buffer<ArrayBufferLike> }
	) {
		if (this.feedlot?.id == null) throw new ErrorHandler(500, "Feedlot não está definida.");

		for (const [fileName, fileBuffer] of Object.entries(files)) {
			this.cowUseCase.createCow({
				state: State.atipico,
				position: Position.ereto,
				idFolder: root_folder_id,
				imageName: fileName,
				feedlotId: this.feedlot.id,
			});
		}
	}

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

		return ;
	

		const farm = await this.farmUseCase.getFarmById({ id: farmId });
		if (!farm) throw new ErrorHandler(404, "Fazenda não encontrada para o usuário.");
		this.farm = new Farm(
			farm.name,
			{
				city: farm.city,
				state: farm.state,
			},
			{
				latitude: farm.latitude,
				longitude: farm.longitude,
			},
			farm.id
		);

		const imageCoordinates = this.getCoordinatesFromImages(buffers);
		const centroide: Coordinate =
			this.centroidCalculator.calculateCenterExactFeedLot(imageCoordinates);

		const responseFeedlots: OutputDTOListFeedlots = await this.feedlotUseCase.getAllFeedlots();
		if (!responseFeedlots.feedlot || responseFeedlots.feedlot.length === 0)
			throw new ErrorHandler(404, "Nenhuma baia encontrada no sistema.");

		const feedlotList: Feedlot[] = responseFeedlots.feedlot.map((f) => {
			return new Feedlot(
				f.name,
				{
					latitude: f.latitude,
					longitude: f.longitude,
				},
				f.farmId,
				f.id
			);
		});

		this.feedlot = this.getFeedlotFromList(feedlotList, centroide);
		if (!this.feedlot) throw new ErrorHandler(404, "Baia não encontrada na lista.");

		// Verifica se a baia está dentro da distância permitida da fazenda
		if (!this.verifyDistanceFeedlotToFarm()) {
			throw new ErrorHandler(400, "Baia está muito distante da fazenda do usuário.");
		}

		const path_save_images: string = `uploads/${this.farm.name}/${infosRequest.root_folder_id}/${this.feedlot.name}/atipico`;
		this.filesService.createFolder(path_save_images);

		const statusRequest = StatusRequest.PROCESSING;

		this.saveMetadadosImages4kResponseIA(
			centroide,
			buffers.length,
			infosRequest.root_folder_id,
			userId,
			statusRequest
		);

		if (!this.feedlot?.id) {
			throw new ErrorHandler(500, "Feedlot não está definida.");
		}

		console.log("Baia selecionada:", this.feedlot.name);
		return {
			message: "Imagens sendo processadas, aguarde...",
		};

		await this.iaService.sendImagesForProcessing(
			buffers,
			infosRequest.root_folder_id,
			path_save_images,
			this.feedlot.id
		);

		// const startTime = performance.now();
		// const files = await this.iaService.getImagesClassifyFromIA(buffers);
		// if (!files) throw new ErrorHandler(500, "Erro ao processar imagens na IA");
		// const endTime = performance.now();

		// console.log("tempo de processamento IA: ", (endTime - startTime) / 60 / 1000, " minutos");
		// this.filesService.saveFilesFromRabbit(path_save_images, files);

		// this.saveCowsResponseIA(infosRequest.root_folder_id, files);

		return {
			message: "Imagens sendo processadas, aguarde...",
			success: true,
		};
	}
}

