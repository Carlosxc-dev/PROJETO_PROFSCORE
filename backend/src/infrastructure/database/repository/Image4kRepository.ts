import { PrismaClient, StatusRequest } from "@prisma/client";
import { ErrorHandler } from "api/error/ErrorHandler";
import { IImages4kRepository } from "core/IRepositories/IImages4kRepository";

import {
	OutputDTOCreateImage4k,
	OutputDTOUpdateImage4k,
	OutputDTODeleteImage4k,
	OutputDTOGetImage4kById,
	OutputDTOListImage4k,
} from "application/modules/image4k/outputDTO/image4kOutputsDTOs";

import {
	InputDTOCreateImage4k,
	InputDTOUpdateImage4k,
	InputDTODeleteImage4k,
	InputDTOGetImage4kById,
} from "application/modules/image4k/inputDTO/Image4kInputDTOs";

export class Images4kRepository implements IImages4kRepository {
	constructor(private client: PrismaClient) {}
	private selectFieldsImage4k = {
		id: true,
		idFolder: true,
		userId: true,
		latitude: true,
		longitude: true,
		createdAt: true,
		feedlotId: true,
		totalImagesRequest: true,
		statusRequest: true,
	};

	async getAllimage4ks(): Promise<OutputDTOListImage4k> {
		const images = await this.client.image4K.findMany({
			select: this.selectFieldsImage4k,
			orderBy: { createdAt: "desc" },
		});

		return { image4k: images || [] };
	}

	async getImage4kById(input: InputDTOGetImage4kById): Promise<OutputDTOGetImage4kById> {
		const image = await this.client.image4K.findUnique({
			where: { id: input.id },
			select: this.selectFieldsImage4k,
		});

		return { image4k: image! };
	}

	async createImage4k(input: InputDTOCreateImage4k): Promise<OutputDTOCreateImage4k> {
		const newImage = await this.client.image4K.create({
			data: {
				idFolder: input.idFolder,
				latitude: input.coordinates.latitude,
				longitude: input.coordinates.longitude,
				totalImagesRequest: input.totalImagesRequest ?? 0,
				feedlotId: input.feedlotId,
				userId: input.userId,
				statusRequest: input.statusRequest ?? "PENDING",
			},
			select: this.selectFieldsImage4k,
		});

		return { image4k: newImage };
	}

	async updateImage4k(input: InputDTOUpdateImage4k): Promise<OutputDTOUpdateImage4k> {
		const updatedImage = await this.client.image4K.update({
			where: { id: input.id },
			data: {
				idFolder: input.idFolder,
				latitude: input.coordinates?.latitude,
				longitude: input.coordinates?.longitude,
				feedlotId: input.feedlotId,
				userId: input.userId,
			},
			select: this.selectFieldsImage4k,
		});

		return { image4k: updatedImage };
	}

	async updateImage4kByIdFolder(idFolder: string, status: StatusRequest): Promise<any> {
		const updatedImage = await this.client.image4K.updateMany({
			where: { idFolder: idFolder },
			data: {
				statusRequest: status,
			},
		});

		return updatedImage;
	}

	async deleteImage4k(input: InputDTODeleteImage4k): Promise<OutputDTODeleteImage4k> {
		await this.client.image4K.delete({
			where: { id: input.id },
		});

		return { id: input.id };
	}

	async countImagesByRequestIdFolder(idFolder: string): Promise<number> {
		const result = await this.client.image4K.aggregate({
			where: { idFolder },
			_sum: { totalImagesRequest: true },
		});

		// Retorna o valor da soma (ou 0 se não houver registros)
		return result._sum.totalImagesRequest ?? 0;
	}

	async getHistoricoRequest(
		userId: string,
		farmId: string
	): Promise<
		Array<{
			idFolder: string;
			farmName: string;
			userId: string;
			totalImagesRequest: number;
			createdAt: Date;
			statusRequest: string;
		}>
	> {
		const folders = await this.client.image4K.groupBy({
			by: ["idFolder"],
			where: {
				userId: userId,
				feedlot: {
					farmId: farmId,
				},
			},
			_sum: {
				totalImagesRequest: true, // SOMA os valores de totalImagesRequest
			},
			orderBy: {
				idFolder: "desc",
			},
		});

		const foldersWithDetails = await Promise.all(
			folders.map(async (folder) => {
				const folderDetail = await this.client.image4K.findFirst({
					where: {
						idFolder: folder.idFolder,
						userId: userId,
					},
					select: {
						statusRequest: true,
						createdAt: true,
						user: {
							select: {
								name: true,
							},
						},
						feedlot: {
							select: {
								farm: {
									select: {
										name: true,
									},
								},
							},
						},
					},
				});

				return {
					idFolder: folder.idFolder,
					farmName: folderDetail?.feedlot?.farm?.name ?? "",
					userId: folderDetail?.user?.name ?? "",
					totalImagesRequest: folder._sum.totalImagesRequest ?? 0, // SOMA dos valores
					createdAt: folderDetail?.createdAt ?? new Date(),
					statusRequest: folderDetail?.statusRequest ?? "",
				};
			})
		);

		return foldersWithDetails;
	}
}

