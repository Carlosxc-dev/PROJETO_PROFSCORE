import { Farm } from "core/entities/farm";
import { Address } from "core/valueObjects/address";
import { Coordinate } from "core/valueObjects/coordinate";
import { User } from "core/entities/user";
import { Feedlot } from "core/entities/feedlot";
import { Cow } from "core/entities/cow";


interface OutputDTOCreateFeed {
    feedlot: Feedlot;
}


interface OutputDTOUpdateFeed {
    feedlot: Feedlot;
}

interface OutputDTODeleteFeed {
    id: string;
}

interface OutputDTOGetFeedById {
    feedlot: Feedlot | null;
}

interface OutputDTOListFeedlots {
    feedlot: Feedlot[];
}

export {
    OutputDTOCreateFeed,
    OutputDTOUpdateFeed,
    OutputDTODeleteFeed,
    OutputDTOGetFeedById,
    OutputDTOListFeedlots
}