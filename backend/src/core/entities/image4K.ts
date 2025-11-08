// src/core/entities/Image4K.ts
import { Coordinate } from "core/valueObjects/coordinate";
import { Feedlot } from "./feedlot";

export class Image4K {
	constructor(
		public coordinate: Coordinate,
		public idFolder: string,
		public userId: string,
		public statusRequest: string,
		public totalImagesRequest?: number,
		public feedlotId?: Feedlot,
		public id?: string,
	) {}
}
