import { Image4K } from "@prisma/client";
import { Coordinate } from "core/valueObjects/coordinate";

// DTOs de saída
export interface OutputDTOCreateImage4k {
	image4k: Image4K;
}

export interface OutputDTOUpdateImage4k {
	image4k: Image4K;
}

export interface OutputDTODeleteImage4k {
	id: string;
}

export interface OutputDTOGetImage4kById {
	image4k: Image4K | null;
}

export interface OutputDTOListImage4k {
	image4k: Image4K[];
}

