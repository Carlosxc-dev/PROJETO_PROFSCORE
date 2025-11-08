import {
	OutputDTOCreateImage4k,
	OutputDTODeleteImage4k,
	OutputDTOGetImage4kById,
	OutputDTOListImage4k,
	OutputDTOUpdateImage4k,
} from "application/modules/image4k/outputDTO/image4kOutputsDTOs";
import {
	InputDTOCreateImage4k,
	InputDTOUpdateImage4k,
	InputDTODeleteImage4k,
	InputDTOGetImage4kById,
} from "../../application/modules/image4k/inputDTO/Image4kInputDTOs";

export interface IImages4kRepository {
	getAllimage4ks(): Promise<OutputDTOListImage4k>;
	createImage4k(input: InputDTOCreateImage4k): Promise<OutputDTOCreateImage4k>;
	getImage4kById(input: InputDTOGetImage4kById): Promise<OutputDTOGetImage4kById>;
	updateImage4k(input: InputDTOUpdateImage4k): Promise<OutputDTOUpdateImage4k>;
	deleteImage4k(input: InputDTODeleteImage4k): Promise<OutputDTODeleteImage4k>;
	countImagesByRequestIdFolder(idFolder: string): Promise<number>;

	updateImage4kByIdFolder(idFolder: string, status: string): Promise<any>;

	getHistoricoRequest(
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
	>;
}

