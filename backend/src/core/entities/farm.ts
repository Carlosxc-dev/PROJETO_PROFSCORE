// src/core/entities/Farm.ts

import { Address } from "core/valueObjects/address";
import { Coordinate } from "core/valueObjects/coordinate";

export class Farm {
	city: string | undefined;
	state: string | undefined;
	latitude: number | undefined;
	longitude: number | undefined;
	constructor(
		public name: string,
		public address: Address,
		public coordinates: Coordinate,
		public license?: string,
		public createdAt: Date = new Date(),
		public updatedAt: Date = new Date(),
		public id?: string,
	) {}
}

