import { 
  InputDTOCreateCow, 
  InputDTOUpdateCow, 
  InputDTODeleteCow, 
  InputDTOGetCowById 
} from "../inputDTO/cowInputDTOs";

import { 
  OutputDTOCreateCow, 
  OutputDTOUpdateCow, 
  OutputDTODeleteCow, 
  OutputDTOGetCowById, 
  OutputDTOListCows 
} from "../outputDTO/cowOutputsDTOs";

export interface ICowUseCase {
	createManyCows(cows: InputDTOCreateCow[]): Promise<boolean>;
	getAllCows(): Promise<OutputDTOListCows>;
	createCow(cow: InputDTOCreateCow): Promise<OutputDTOCreateCow>;
	getCowById(cowIdDTO: InputDTOGetCowById): Promise<OutputDTOGetCowById>;
	updateCow(cowData: InputDTOUpdateCow): Promise<OutputDTOUpdateCow>;
	deleteCow(cowIdDTO: InputDTODeleteCow): Promise<OutputDTODeleteCow>;
}
