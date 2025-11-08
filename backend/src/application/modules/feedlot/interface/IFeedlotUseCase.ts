import {
    InputDTOCreateFeedlot,
    InputDTOUpdateFeedlot,
    InputDTODeleteFeedlot,
    InputDTOGetFeedlotById
} from "../inputDTO/FeedlotInputDTOs";

import {
    OutputDTOCreateFeed,
    OutputDTOUpdateFeed,
    OutputDTODeleteFeed,
    OutputDTOGetFeedById,
    OutputDTOListFeedlots
} from "../outputDTO/FeedlotOutputsDTOs";

export interface IFeedlotUseCase {
    getFeedlotById(getFeedlotById: InputDTOGetFeedlotById): Promise<OutputDTOGetFeedById>;
	getAllFeedlots(): Promise<OutputDTOListFeedlots>;
	createFeedlot(createFeedlotDTO: InputDTOCreateFeedlot): Promise<OutputDTOCreateFeed>;
	updateFeedlot(updateFarm: InputDTOUpdateFeedlot): Promise<OutputDTOUpdateFeed>;
	deleteFeedlot(deleteFeedlotDTO: InputDTODeleteFeedlot): Promise<OutputDTODeleteFeed>;
}