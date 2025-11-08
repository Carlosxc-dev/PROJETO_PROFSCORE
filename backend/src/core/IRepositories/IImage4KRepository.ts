import { Image4K } from "core/entities/image4K";

export interface IImage4KRepository {
	getImages4kById(data: string): Promise<Image4K | null>;
	getImages4kByURL(data: string): Promise<Image4K | null>;
	getAllImages4k(): Promise<Image4K[]>;
	createImages4k(data: Image4K): Promise<Image4K>;
	updateImages4k(data: Image4K): Promise<Image4K>;
	deleteImages4k(data: string): Promise<Image4K>;
}
