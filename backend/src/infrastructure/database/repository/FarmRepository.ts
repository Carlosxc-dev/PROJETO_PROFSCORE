// src/infrastructure/repositories/FarmRepository.ts
import {
	InputDTOCreateFarm,
	InputDTODeleteFarm,
	InputDTOGetFarmById,
	InputDTOUpdateFarm,
} from "application/modules/farm/inputDTO/FarmInputDTOs";
import {
	OutputDTOCreateFarm,
	OutputDTODeleteFarm,
	OutputDTOGetFarmById,
	OutputDTOListFarms,
	OutputDTOUpdateFarm,
} from "application/modules/farm/outputDTO/FarmOutputsDTOs";
import { Farm } from "core/entities/farm";
import { IFarmRepository } from "core/IRepositories/IFarmRepository";

export class FarmRepository implements IFarmRepository {
	constructor(private client: any) {}
	private selectFieldsFarms = {
		id: true,
		name: true,
		city: true,
		state: true,
		latitude: true,
		longitude: true,
		license: true,
		createdAt: true,
		updatedAt: true,
		feedlots: false,
	};

	async findFarmById(farmId: InputDTOGetFarmById): Promise<OutputDTOGetFarmById> {
		const farm = await this.client.farm.findUnique({
			where: { id: farmId },
			select: this.selectFieldsFarms,
		});
		return farm;
	}

	async getAllFarms(): Promise<Farm[]> {
		const farms = await this.client.farm.findMany({
			select: this.selectFieldsFarms,
			orderBy: { createdAt: "desc" },
		});
		return farms;
	}

	async getFarmById(farmId: InputDTOGetFarmById): Promise<OutputDTOGetFarmById> {
		const farm = await this.client.farm.findUnique({
			where: { id: farmId.id },
			select: this.selectFieldsFarms,
		});
		return farm;
	}

	async createFarm(farmData: InputDTOCreateFarm): Promise<OutputDTOCreateFarm> {
		return await this.client.farm.create({
			data: {
				name: farmData.name,
				city: farmData.address.city,
				state: farmData.address.state,
				latitude: farmData.coordinates.latitude,
				longitude: farmData.coordinates.longitude,
				license: farmData.license,
			},
			select: this.selectFieldsFarms,
		});
	}

	async getFarmByName(farmName: string): Promise<OutputDTOGetFarmById | null> {
		const farm = await this.client.farm.findFirst({
			where: { name: farmName },
			select: this.selectFieldsFarms,
		});
		return farm;
	}

	async updateFarm(farmData: InputDTOUpdateFarm): Promise<OutputDTOUpdateFarm> {
		return await this.client.farm.update({
			where: { id: farmData.id },
			data: farmData,
			select: this.selectFieldsFarms,
		});
	}

	async deleteFarm(farmId: InputDTODeleteFarm): Promise<OutputDTODeleteFarm> {
		return await this.client.farm.delete({
			where: { id: farmId.id },
		});
	}
}

