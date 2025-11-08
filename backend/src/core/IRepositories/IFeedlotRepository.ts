import { InputDTOCreateCowId, InputDTODeleteCow } from "application/modules/cow/inputDTO/cowInputDTOs";
import { Feedlot } from "core/entities/feedlot";


export interface IFeedlotRepository {
	getAllFeedlots(): Promise<Feedlot[]>;
	getFeedlotById(feedlotId: string): Promise<Feedlot | null>;
	createFeedlot(FeedlotData: Feedlot): Promise<Feedlot>;
	updateFeedlot(feedlotData: Feedlot): Promise<Feedlot>;
	deleteFeedlot(FeedlotId: string): Promise<any>;
	getFeedlotByName(name: string): Promise<Feedlot | null>;
}
