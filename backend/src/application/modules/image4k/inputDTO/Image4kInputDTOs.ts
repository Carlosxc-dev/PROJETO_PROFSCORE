import { Coordinate } from "core/valueObjects/coordinate";

// DTOs de entrada
export interface InputDTOCreateImage4k {
	coordinates: Coordinate;
	idFolder: string;
	userId: string;
	totalImagesRequest?: number;
	feedlotId: string;
	statusRequest: string;
}

export interface InputDTOUpdateImage4k {
	id: string;
	coordinates?: Coordinate;
	idFolder?: string;
	userId?: string;
	totalImagesRequest?: number;
	feedlotId?: string;
	statusRequest?: string;
}

export interface InputDTODeleteImage4k {
	id: string;
}

export interface InputDTOGetImage4kById {
	id: string;
}

