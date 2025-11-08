// src/core/entities/Feedlot.ts
import { Farm } from "./farm";
import { Cow } from "./cow";
import { Image4K } from "./image4K";
import { Coordinate } from "core/valueObjects/coordinate";

export class Feedlot {
	constructor(
		public name: string,
		public coordinate: Coordinate,
		public farmId: string,
		public id?: string,
	) {}
}

