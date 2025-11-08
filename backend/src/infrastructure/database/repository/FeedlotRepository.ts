// src/infrastructure/repositories/FarmRepository.ts
import { ErrorHandler } from "api/error/ErrorHandler";
import { Feedlot } from "core/entities/feedlot";
import { IFeedlotRepository } from "core/IRepositories/IFeedlotRepository";

export class FeedlotRepository implements IFeedlotRepository {
	constructor(private client: any) {}
	private selectFieldsFeedlot = {
		id: true,
		name: true,
		latitude: true,
		longitude: true,
		farmId: true,
		createdAt: true,
		updatedAt: true,
	};

	async getAllFeedlots(): Promise<Feedlot[]> {
		const allFeedlots: Feedlot[] = await this.client.feedlot.findMany({
			select: this.selectFieldsFeedlot,
			orderBy: { createdAt: "desc" },
		});
		return allFeedlots;
	}

	async getFeedlotByName(name: string): Promise<Feedlot | null> {
		const feedlot = await this.client.feedlot.findFirst({
			where: { name: name },
			select: this.selectFieldsFeedlot,
		});
		return feedlot;
	}

	async getFeedlotById(feedlotId: string): Promise<Feedlot | null> {
		const feedlot = await this.client.feedlot.findUnique({
			where: { id: feedlotId },
			select: this.selectFieldsFeedlot,
		});
		return feedlot;
	}

	async createFeedlot(FeedlotData: Feedlot): Promise<Feedlot> {
		return await this.client.feedlot.create({
			data: {
				name: FeedlotData.name,
				latitude: FeedlotData.coordinate.latitude,
				longitude: FeedlotData.coordinate.longitude,
				farmId: FeedlotData.farmId,
			},
			select: this.selectFieldsFeedlot,
		});
	}

	async updateFeedlot(feedlotData: Feedlot): Promise<Feedlot> {
		return await this.client.feedlot.update({
			where: { id: feedlotData.id },
			data: {
				name: feedlotData.name,
				latitude: feedlotData.coordinate.latitude,
				longitude: feedlotData.coordinate.longitude,
				farmId: feedlotData.farmId,
			},
			select: this.selectFieldsFeedlot,
		});
	}

	async deleteFeedlot(FeedlotId: string): Promise<any> {
		return await this.client.Feedlot.delete({
			where: { id: FeedlotId },
			select: this.selectFieldsFeedlot,
		});
	}
}

