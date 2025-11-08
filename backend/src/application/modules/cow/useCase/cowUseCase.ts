import { ErrorHandler } from "api/error/ErrorHandler";
import { ICowRepository } from "core/IRepositories/IcowRepository";
import { IFeedlotRepository } from "core/IRepositories/IFeedlotRepository";

import {
	OutputDTOCreateCow,
	OutputDTOUpdateCow,
	OutputDTODeleteCow,
	OutputDTOGetCowById,
	OutputDTOListCows,
} from "../../../modules/cow/outputDTO/cowOutputsDTOs";

import {
	InputDTOCreateCow,
	InputDTOUpdateCow,
	InputDTODeleteCow,
	InputDTOGetCowById,
} from "../../../modules/cow/inputDTO/cowInputDTOs";
import { ICowUseCase } from "../interface/IcowUseCase";
import { Cow } from "core/entities/cow";
import { State } from "core/enums/state";
import { Position } from "core/enums/position";

export class CowUseCase implements ICowUseCase {
	constructor(
		private cowRepository: ICowRepository,
		private feedlotRepository: IFeedlotRepository
	) {}

	createManyCows(cows: InputDTOCreateCow[]): Promise<boolean> {
		const isCreated =  this.cowRepository.createManyCows(cows);
		return isCreated;
	}

	async getAllCows(): Promise<OutputDTOListCows> {
		const allCows: OutputDTOListCows = await this.cowRepository.getAllCows();
		return allCows;
	}

	async createCow(dto: InputDTOCreateCow): Promise<OutputDTOCreateCow> {
		const newCow = new Cow(
			dto.state,
			dto.position,
			dto.idFolder,
			dto.imageName,
			dto.feedlotId
		);
		const response = await this.cowRepository.createCow(newCow);
		return { cow: response.cow };
	}

	async getCowById(cowIdDTO: InputDTOGetCowById): Promise<OutputDTOGetCowById> {
		const cow = await this.cowRepository.getCowById(cowIdDTO);
		if (!cow) throw new ErrorHandler(404, `Cow com id ${cowIdDTO.id} não encontrada`);
		return cow;
	}

	async updateCow(cowData: InputDTOUpdateCow): Promise<OutputDTOUpdateCow> {
		const existingCow = await this.cowRepository.getCowById({ id: cowData.id });
		if (!existingCow)
			throw new ErrorHandler(404, `Cow com id ${cowData.id} não encontrada`);

		// Atualiza apenas os campos fornecidos no DTO
		const updatedCow: InputDTOUpdateCow = {
			id: cowData.id,
			state: cowData.state ?? existingCow.cow?.state as State,
			position: cowData.position ?? existingCow.cow?.position as Position,
			idFolder: cowData.idFolder ?? existingCow.cow?.idFolder,
			imageName: cowData.imageName ?? existingCow.cow?.imageName,
			feedlotId: cowData.feedlotId ?? existingCow.cow?.feedlotId,
		}

		const response = await this.cowRepository.updateCow(updatedCow);
		return { cow: response.cow };
	}

	// Use case
	async deleteCow(cowIdDTO: InputDTODeleteCow): Promise<OutputDTODeleteCow> {
		const existingCow = await this.cowRepository.getCowById({ id: cowIdDTO.id });
		if (!existingCow)
			throw new ErrorHandler(404, `Cow com id ${cowIdDTO.id} não encontrada`);

		await this.cowRepository.deleteCow(cowIdDTO);
		return { id: cowIdDTO.id };
	}
}

