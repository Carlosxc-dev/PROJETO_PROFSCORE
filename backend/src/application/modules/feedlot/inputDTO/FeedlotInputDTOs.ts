import { Address } from "core/valueObjects/address";
import { Coordinate } from "core/valueObjects/coordinate";
import { User } from "core/entities/user";
import { Feedlot } from "core/entities/feedlot";
import { Cow } from "@prisma/client";

interface InputDTOCreateFeedlot {
    name: string;
    coordinates: Coordinate;
    farmId: string;
    cows?: string [];
    image4k?: string[];
}

interface InputDTOUpdateFeedlot {
    id: string;
    name: string;
    coordinates: Coordinate;
    farmId: string;
    cows?: string [];
    image4k?: string[];
}

interface InputDTODeleteFeedlot {
    id: string;
}

interface InputDTOGetFeedlotById {
    id: string;
}

export {
    InputDTOCreateFeedlot,
    InputDTOUpdateFeedlot,
    InputDTODeleteFeedlot,
    InputDTOGetFeedlotById
}