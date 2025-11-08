import { State } from "core/enums/state";
import { Position } from "core/enums/position";
import { Cow } from "@prisma/client";

// DTO para criar uma vaca
interface InputDTOCreateCow {
	state: State;
	position: Position;
	idFolder: string;
	imageName: string;
	feedlotId: string;
	url_image: string;
}


// DTO para atualizar uma vaca
interface InputDTOUpdateCow {
    id: string;
	name?: string;
	state?: State;
	position?: Position;
	feedlotId?: string;
	idFolder?: string;
	imageName?: string;
	url_image?: string;
}

// DTO para deletar uma vaca
interface InputDTODeleteCow {
    id: string;
}

// DTO para obter uma vaca por ID
interface InputDTOGetCowById {
    id: string;
}

export {
    InputDTOCreateCow,
    InputDTOUpdateCow,
    InputDTODeleteCow,
    InputDTOGetCowById,
};
