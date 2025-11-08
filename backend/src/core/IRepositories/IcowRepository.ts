import {
	OutputDTOCreateCow,
	OutputDTODeleteCow,
	OutputDTOGetCowById,
	OutputDTOListCows,
	OutputDTOUpdateCow,
} from "../../application/modules/cow/outputDTO/cowOutputsDTOs";

import {
	InputDTOCreateCow,
	InputDTOUpdateCow,
	InputDTODeleteCow,
	InputDTOGetCowById,
} from "../../application/modules/cow/inputDTO/cowInputDTOs";
import { Cow } from "core/entities/cow";
import { Decimal } from "@prisma/client/runtime/library";

export interface ICowRepository {
	getAllCows(): Promise<OutputDTOListCows>;
	createCow(createCowDTO: Cow): Promise<OutputDTOCreateCow>;
	getCowById(getCowByIdDTO: InputDTOGetCowById): Promise<OutputDTOGetCowById>;
	deleteCow(deleteCowDTO: InputDTODeleteCow): Promise<OutputDTODeleteCow>;
	updateCow(updateCowDTO: InputDTOUpdateCow): Promise<OutputDTOUpdateCow>;
	createManyCows(cows: InputDTOCreateCow[]): Promise<boolean>;
	getUrlFromRequest(
		idFolder: string,
		farmName: string,
		userId: string
	): Promise<{
		response: Array<{
			nameBaia: string;
			urls: string[];
			coordenadas: {
				latitude: Decimal | number;
				longitude: Decimal | number;
			};
		}>;
	} | null>;
}

