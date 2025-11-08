import { Address } from "../valueObjects/address";
import { Coordinate } from "../valueObjects/coordinate";
import { User } from "./user-entities";

export interface Farm {
	id: string;
	name: string;
	address: Address;
	coordinates: Coordinate;
	license: string;
	user?: string;
	feedlots: string[];
}

export interface OutputDTOCreateFarm {
	id: string;
	name: string;
	adress: Address;
	coordinates: Coordinate;
	license: string;
	user?: string;
	feedlots: string[];
}

export interface OutputDTOUpdateFarm {
    id: string;
    name: string;
    address: Address;      // corrige o typo
    coordinates: Coordinate;
    license: string;
    user?: string;
    feedlots: string[];
}
export interface OutputDTODeleteFarm {
	id: string;
}

export interface OutputDTOGetFarmById {
	farm: Farm
}

export interface OutputDTOGetFarmByName {
	farm: Farm
}

export interface OutputDTOListFarms {
  farms: any[];
}

export interface OutputDTOAddFeedlotToFarm extends OutputDTOUpdateFarm {
  feedlots: string[]; // atualiza feedlots
}

export interface OutputDTORemoveFeedlotToFarm extends OutputDTOUpdateFarm {
  feedlots: string[]; // atualiza feedlots
}



export  interface InputDTOCreateFarm {
    name: string;
    address: Address;
    coordinates: Coordinate;
    license: string;
    feedlots?: string[];
}

export interface InputDTOUpdateFarm {
    id: string;
    name?: string;
    address?: Address;
    coordinates?: Coordinate;
    license?: string;
    userId?: User;
    feedlots?: string[];
}

export interface InputDTODeleteFarm {
	id: string;
}

export interface InputDTOGetFarmById {
	id: string;
}

export interface InputDTOGetFarmByName {
  name: string;
}

export interface InputDTOAddFeedlotToFarm {
  farmId: string;
  feedlotId: string;
}

export interface InputDTORemoveFeedlotFromFarm {
  farmId: string;
  feedlotId: string;
}

export interface InputDTOFindFarmById {
  id: string;
}

export interface InputDTOAddFeedlotToFarm {
  farmId: string;
  feedlotId: string;
}