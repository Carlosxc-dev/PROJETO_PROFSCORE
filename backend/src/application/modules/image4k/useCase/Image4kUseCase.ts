import { ErrorHandler } from "api/error/ErrorHandler";
import {
    InputDTOCreateImage4k,
    InputDTOUpdateImage4k,
    InputDTODeleteImage4k,
    InputDTOGetImage4kById,
} from "../inputDTO/Image4kInputDTOs";
import {
    OutputDTOCreateImage4k,
    OutputDTOUpdateImage4k,
    OutputDTODeleteImage4k,
    OutputDTOGetImage4kById,
    OutputDTOListImage4k
} from "../outputDTO/image4kOutputsDTOs";

import { IImages4kRepository } from "core/IRepositories/IImages4kRepository";
import { IFeedlotRepository } from "core/IRepositories/IFeedlotRepository";
import { IImage4kUseCase } from "../interface/IimageUseCase";
import { StatusRequest } from "@prisma/client";

export class Image4kUseCase implements IImage4kUseCase{
    constructor(
        private image4kRepository: IImages4kRepository,
        private feedlotRepository: IFeedlotRepository
    ) { }

    async getAllimage4ks(): Promise<OutputDTOListImage4k> {
        const images = await this.image4kRepository.getAllimage4ks();
		return images || { image4k: [] }; // Retorna um array vazio se allUsers for null ou undefined
    }

    async createImage4k(input: InputDTOCreateImage4k): Promise<OutputDTOCreateImage4k> {
        const newImage = await this.image4kRepository.createImage4k(input);
		return newImage;
    }

    async getImage4kById(input: InputDTOGetImage4kById): Promise<OutputDTOGetImage4kById> {
        const image = await this.image4kRepository.getImage4kById(input);
		if (!image) {
			throw new ErrorHandler(404, `Image4k com id ${input.id} não encontrada`);
		}
		return image;
    }

    async updateImage4k(input: InputDTOUpdateImage4k): Promise<OutputDTOUpdateImage4k> {
        const image = await this.image4kRepository.getImage4kById({ id: input.id });
		if (!image) {
			throw new ErrorHandler(404, `Image4k com id ${input.id} não encontrada`);
		}
		const updatedImage = await this.image4kRepository.updateImage4k(input);
		return updatedImage;
    }

    async updateImage4kByIdFolder(input: string, status: StatusRequest): Promise<any> {
		if (!status) {
			throw new ErrorHandler(400, `Status é obrigatório.`);
		}

		const updatedImage = await this.image4kRepository.updateImage4kByIdFolder(input, status);
		return updatedImage;
    }

    async deleteImage4k(input: InputDTODeleteImage4k): Promise<OutputDTODeleteImage4k> {
        const image = await this.image4kRepository.getImage4kById({ id: input.id });
		if (!image) {
			throw new ErrorHandler(404, `Image4k com id ${input.id} não encontrada`);
		}
		const deletedImage = await this.image4kRepository.deleteImage4k(input);
		return deletedImage;
    }
}
