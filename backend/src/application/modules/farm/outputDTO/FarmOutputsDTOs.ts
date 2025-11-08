import { Farm } from "core/entities/farm";


interface OutputDTOCreateFarm {
	farm: Farm;
}

interface OutputDTOUpdateFarm {
	farm: Farm;
}
interface OutputDTODeleteFarm {
	id: string;
}

interface OutputDTOGetFarmById {
	farm: Farm;
}

interface OutputDTOGetFarmByName {
	farm: Farm
}

interface OutputDTOListFarms{
	farms: Farm[]
}


export {
	OutputDTOCreateFarm,
	OutputDTOUpdateFarm,
	OutputDTODeleteFarm,
	OutputDTOGetFarmById,
	OutputDTOListFarms,
	OutputDTOGetFarmByName
};
