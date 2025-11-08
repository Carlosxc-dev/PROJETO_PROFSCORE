import { PrismaClient } from "@prisma/client";
import { ErrorHandler } from "api/error/ErrorHandler";
import { ICowRepository } from "../../../core/IRepositories/IcowRepository";

import {
	OutputDTOCreateCow,
	OutputDTOUpdateCow,
	OutputDTODeleteCow,
	OutputDTOGetCowById,
	OutputDTOListCows,
} from "../../../application/modules/cow/outputDTO/cowOutputsDTOs";

import {
	InputDTOCreateCow,
	InputDTOUpdateCow,
	InputDTODeleteCow,
	InputDTOGetCowById,
} from "../../../application/modules/cow/inputDTO/cowInputDTOs";
import { tr } from "zod/v4/locales";
import { Cow } from "core/entities/cow";
import { Decimal } from "@prisma/client/runtime/library";

export class CowRepository implements ICowRepository {
	constructor(private client: PrismaClient) {}

	private selectFieldsCow = {
		id: true,
		state: true,
		position: true,
		feedlotId: true,
		idFolder: true,
		imageName: true,
		createdAt: true,
		updatedAt: true,
	};

	async getAllCows(): Promise<OutputDTOListCows> {
		const cowsData = await this.client.cow.findMany({
			select: this.selectFieldsCow,
			orderBy: { createdAt: "desc" },
		});
		return { cows: cowsData };
	}

	async getCowById(getCowByIdDTO: InputDTOGetCowById): Promise<OutputDTOGetCowById> {
		const cowData = await this.client.cow.findUnique({
			where: { id: getCowByIdDTO.id },
			select: this.selectFieldsCow,
		});

		return { cow: cowData };
	}

	async createCow(input: Cow): Promise<OutputDTOCreateCow> {
		const newCow = await this.client.cow.create({
			data: {
				state: input.state,
				position: input.position,
				feedlotId: input.feedlotId,
				idFolder: input.idFolder,
				imageName: input.imageName,
			},
			select: this.selectFieldsCow,
		});

		return { cow: newCow };
	}

	async updateCow(input: InputDTOUpdateCow): Promise<OutputDTOUpdateCow> {
		const updatedCow = await this.client.cow.update({
			where: { id: input.id },
			data: {
				state: input.state,
				position: input.position,
				feedlotId: input.feedlotId,
				idFolder: input.idFolder,
				imageName: input.imageName,
			},
			select: this.selectFieldsCow,
		});

		return { cow: updatedCow };
	}

	async deleteCow(input: InputDTODeleteCow): Promise<OutputDTODeleteCow> {
		return await this.client.cow.delete({
			where: { id: input.id },
			select: { id: true },
		});
	}

	async createManyCows(cows: InputDTOCreateCow[]): Promise<boolean> {
		await this.client.cow.createMany({
			data: cows,
			skipDuplicates: true, // ignora duplicatas com base na chave primária
		});

		return true;
	}

	async getUrlFromRequest(
		idFolder: string,
		farmName: string,
		userId: string
	): Promise<{
		response: Array<{
			nameBaia: string;
			urls: string[];
			coordenadas: {
				latitude: Decimal | number;
				longitude: Decimal | number;
			};
		}>;
	} | null> {
		const cows = await this.client.cow.findMany({
			where: {
				idFolder: idFolder,
				feedlot: {
					farm: {
						name: farmName,
						users: {
							some: { name: userId },
						},
					},
				},
			},
			select: {
				imageName: true,
				state: true,
				idFolder: true,
				feedlot: {
					select: {
						name: true,
						latitude: true,
						longitude: true,
					},
				},
			},
			orderBy: {
				feedlot: { name: "asc" },
			},
		});

		if (cows.length === 0) return null;

		// Mapa para agrupar por baia (feedlot) com coordenadas
		const baiaMap = new Map<
			string,
			{
				urls: string[];
				latitude: Decimal | number;
				longitude: Decimal | number;
			}
		>();

		for (const cow of cows) {
			const nameBaia = cow.feedlot?.name ?? "";
			const idFolder = cow.idFolder;
			const latitude = cow.feedlot?.latitude ?? 0;
			const longitude = cow.feedlot?.longitude ?? 0;
			const state = cow.state;
			const url = cow.imageName;

			if (!baiaMap.has(nameBaia)) {
				baiaMap.set(nameBaia, {
					urls: [],
					latitude,
					longitude,
				});
			}

			baiaMap.get(nameBaia)!.urls.push(url);
		}

		// Converte para array
		const response = Array.from(baiaMap.entries()).map(([nameBaia, data]) => ({
			nameBaia,
			urls: data.urls,
			coordenadas: {
				latitude: data.latitude,
				longitude: data.longitude,
			},
		}));

		return { response };
	}

	
}

