import { IFarmRepository } from "core/IRepositories/IFarmRepository";
import {
	InputDTOCreateFarm,
	InputDTOUpdateFarm,
	InputDTODeleteFarm,
	InputDTOGetFarmById,
} from "../inputDTO/FarmInputDTOs";
import {
	OutputDTOListFarms,
	OutputDTOCreateFarm,
	OutputDTOUpdateFarm,
	OutputDTODeleteFarm,
	OutputDTOGetFarmById,
} from "../outputDTO/FarmOutputsDTOs";
import { IFarmUseCase } from "../interface/IFarmUseCase";
import { Farm } from "core/entities/farm";
import { IUserRepository } from "core/IRepositories/IUserRepository";
import { ErrorHandler } from "api/error/ErrorHandler";

export class FarmUseCase implements IFarmUseCase {
	constructor(
		private farmRepository: IFarmRepository,
		private userRepository: IUserRepository
	) {}

	async getAllFarms(): Promise<OutputDTOListFarms> {
		const allFarms = await this.farmRepository.getAllFarms();
		return { farms: allFarms ?? [] }; 
	}

	async createFarm(createFarmDTO: InputDTOCreateFarm): Promise<OutputDTOCreateFarm> {
		const existingFarm = await this.farmRepository.getFarmByName(createFarmDTO.name);
		if (existingFarm) throw new ErrorHandler(409, "Farm name already in use");

		const newFarm = new Farm(
			createFarmDTO.name,
			createFarmDTO.address,
			createFarmDTO.coordinates,
			createFarmDTO.license,
			new Date(),
			new Date(),
		);

		const createdFarm = await this.farmRepository.createFarm(newFarm);
		return createdFarm;
	}

	async updateFarm(updateFarmDTO: InputDTOUpdateFarm): Promise<OutputDTOUpdateFarm> {
		const farm = await this.farmRepository.getFarmById({ id: updateFarmDTO.id });
		if (!farm) throw new ErrorHandler(404, "Farm not found");

		const updatedFarmData = {
			id: updateFarmDTO.id,
			name: updateFarmDTO.name ?? farm.farm.name,
			city: updateFarmDTO.address?.city ?? farm.farm.city,
			state: updateFarmDTO.address?.state ?? farm.farm.state,
			latitude: updateFarmDTO.coordinates?.latitude ?? farm.farm.latitude,
			longitude: updateFarmDTO.coordinates?.longitude ?? farm.farm.longitude,
			license: updateFarmDTO.license ?? farm.farm.license,
		};

		const updatedFarm = await this.farmRepository.updateFarm(updatedFarmData);
		return updatedFarm;
	}

	async deleteFarm(deleteFarmDTO: InputDTODeleteFarm): Promise<OutputDTODeleteFarm> {
		const farm = await this.farmRepository.getFarmById({ id: deleteFarmDTO.id });
		if (!farm) throw new ErrorHandler(404, "Farm not found");

		const deletedFarm = await this.farmRepository.deleteFarm({ id: deleteFarmDTO.id });
		return deletedFarm;
	}

	async getFarmById(getFarmByIdDTO: InputDTOGetFarmById): Promise<OutputDTOGetFarmById> {
		const farm = await this.farmRepository.getFarmById({ id: getFarmByIdDTO.id });
		if (!farm) throw new ErrorHandler(404, "farm not found");
		return farm;
	}
}
