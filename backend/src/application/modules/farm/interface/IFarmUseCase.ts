import {
	OutputDTOCreateFarm,
	OutputDTOUpdateFarm,
	OutputDTODeleteFarm,
	OutputDTOGetFarmById,
	OutputDTOListFarms,
} from "../outputDTO/FarmOutputsDTOs";

import {
	InputDTOCreateFarm,
	InputDTOUpdateFarm,
	InputDTODeleteFarm,
	InputDTOGetFarmById,
} from "../inputDTO/FarmInputDTOs";

export interface IFarmUseCase {
	getAllFarms(): Promise<OutputDTOListFarms| null>;

	createFarm(createFarmDTO: InputDTOCreateFarm): Promise<OutputDTOCreateFarm>;

	getFarmById(
		getFarmById: InputDTOGetFarmById
	): Promise<OutputDTOGetFarmById| null>;

	deleteFarm(deleteFarm: InputDTODeleteFarm): Promise<OutputDTODeleteFarm>;

	updateFarm(updateFarm: InputDTOUpdateFarm): Promise<OutputDTOUpdateFarm>;
}
