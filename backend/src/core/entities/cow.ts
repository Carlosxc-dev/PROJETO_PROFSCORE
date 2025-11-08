// src/core/entities/Cow.ts
import { Position } from "./../enums/position";
import { State } from "./../enums/state";

export class Cow {
	constructor(
		public state: State,
		public position: Position,
		public idFolder: string,
		public imageName: string,
		public feedlotId: string | null,
		public id?: string
	) {}
}

