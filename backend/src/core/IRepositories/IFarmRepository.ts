import {
	InputDTOCreateFarm,
	InputDTODeleteFarm,
	InputDTOFindFarmById,
	InputDTOGetFarmById,
	InputDTOGetFarmByName,
	InputDTOUpdateFarm,
} from "application/modules/farm/inputDTO/FarmInputDTOs";
import {
	OutputDTOCreateFarm,
	OutputDTODeleteFarm,
	OutputDTOGetFarmById,
	OutputDTOListFarms,
	OutputDTOUpdateFarm,
} from "application/modules/farm/outputDTO/FarmOutputsDTOs";
import { Farm } from "core/entities/farm";

export interface IFarmRepository {
	getAllFarms(): Promise<Farm[]>;
	findFarmById(input: InputDTOFindFarmById): Promise<OutputDTOGetFarmById | null>;
	createFarm(farmData: InputDTOCreateFarm): Promise<OutputDTOCreateFarm>;
	updateFarm(farmData: InputDTOUpdateFarm): Promise<OutputDTOUpdateFarm>;
	deleteFarm(farmData: InputDTODeleteFarm): Promise<OutputDTODeleteFarm>;
	getFarmById(farmData: InputDTOGetFarmById): Promise<OutputDTOGetFarmById | null>;
	getFarmByName(name: string): Promise<OutputDTOGetFarmById | null>;
}

