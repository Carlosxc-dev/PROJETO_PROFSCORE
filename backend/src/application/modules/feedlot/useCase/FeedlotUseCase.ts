import {
	InputDTOCreateFeedlot,
	InputDTOUpdateFeedlot,
	InputDTODeleteFeedlot,
	InputDTOGetFeedlotById,
} from "../inputDTO/FeedlotInputDTOs";

import {
	OutputDTOCreateFeed,
	OutputDTOUpdateFeed,
	OutputDTODeleteFeed,
	OutputDTOGetFeedById,
	OutputDTOListFeedlots,
} from "../outputDTO/FeedlotOutputsDTOs";
import { IFeedlotUseCase } from "../interface/IFeedlotUseCase";
import { IFeedlotRepository } from "core/IRepositories/IFeedlotRepository";
import { IFarmRepository } from "core/IRepositories/IFarmRepository";
import { ErrorHandler } from "api/error/ErrorHandler";
import { Feedlot } from "core/entities/feedlot";

export class FeedlotUseCase implements IFeedlotUseCase {
	constructor(
		private feedlotRepository: IFeedlotRepository,
		private farmRepository: IFarmRepository
	) {}

	async getFeedlotById(getFeedlotById: InputDTOGetFeedlotById): Promise<OutputDTOGetFeedById> {
		const feedlot = await this.feedlotRepository.getFeedlotById(getFeedlotById.id);
		return { feedlot: feedlot ?? null };
	}

	async getAllFeedlots(): Promise<OutputDTOListFeedlots> {
		const allFeedlots = await this.feedlotRepository.getAllFeedlots();
		return { feedlot: allFeedlots ?? [] };
	}

	async createFeedlot(createFeedlotDTO: InputDTOCreateFeedlot): Promise<OutputDTOCreateFeed> {
		const alreadyExists = await this.feedlotRepository.getFeedlotByName(createFeedlotDTO.name);

		if (alreadyExists) {
			throw new ErrorHandler(
				400,
				`Feedlot with name ${createFeedlotDTO.name} already exists`
			);
		}

		const newFeedlot = new Feedlot(
			createFeedlotDTO.name,
			createFeedlotDTO.coordinates,
			createFeedlotDTO.farmId
		);
		const createdFeedlot = await this.feedlotRepository.createFeedlot(newFeedlot);
		return { feedlot: createdFeedlot };
	}

	async deleteFeedlot(deleteFeedlotDTO: InputDTODeleteFeedlot): Promise<OutputDTODeleteFeed> {
		const feedlot = await this.feedlotRepository.getFeedlotById(deleteFeedlotDTO.id);
		if (!feedlot) throw new ErrorHandler(404, "Feedlot not found");

		await this.feedlotRepository.deleteFeedlot(deleteFeedlotDTO.id);
		return { id: deleteFeedlotDTO.id };
	}

	async updateFeedlot(updateFarm: InputDTOUpdateFeedlot): Promise<OutputDTOUpdateFeed> {
		const feedlot = await this.feedlotRepository.getFeedlotById(updateFarm.id);
		if (!feedlot) throw new ErrorHandler(404, "Feedlot not found");

		const updatedFeedlotData = new Feedlot(
			updateFarm.name ?? feedlot.name,
			updateFarm.coordinates ?? {
				latitude: feedlot.coordinate.latitude,
				longitude: feedlot.coordinate.longitude,
			},
			updateFarm.farmId ?? feedlot.farmId,
			feedlot.id
		);

		const updatedFeedlot = await this.feedlotRepository.updateFeedlot(updatedFeedlotData);
		return { feedlot: updatedFeedlot };
	}
}

