import { Address } from "core/valueObjects/address";
import { Coordinate } from "core/valueObjects/coordinate";

export  interface InputDTOCreateFarm {
    name: string;
    address: Address;
    coordinates: Coordinate;
    license?: string;
}

export interface InputDTOUpdateFarm {
    id: string;
    name?: string;
    address?: Address;
    coordinates?: Coordinate;
    license?: string;
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


export interface InputDTOFindFarmById {
  id: string;
}