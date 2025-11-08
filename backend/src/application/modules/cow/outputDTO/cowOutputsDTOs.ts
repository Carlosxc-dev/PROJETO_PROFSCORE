import { Cow, Cow as PrismaCow } from "@prisma/client"; // se estiver usando Prisma
import { State, Position } from "@prisma/client";


// DTO de saída para criação de vaca
interface OutputDTOCreateCow {
    cow: Cow;
}

interface OutputDTOUpdateCow {
    cow: Cow;
}

// DTO de saída para deleção de vaca
interface OutputDTODeleteCow {
    id: string;
}

// DTO de saída para obter uma vaca por ID
interface OutputDTOGetCowById {
    cow: Cow | null;
}

// DTO de saída para listar várias vacas
interface OutputDTOListCows {
    cows: Cow[]; 
}

export {
    OutputDTOCreateCow,
    OutputDTOUpdateCow,
    OutputDTODeleteCow,
    OutputDTOGetCowById,
    OutputDTOListCows
};
