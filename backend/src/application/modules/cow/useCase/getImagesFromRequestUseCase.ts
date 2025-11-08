import { ICowRepository } from "core/IRepositories/IcowRepository";
import { IImage4KRepository } from "core/IRepositories/IImage4KRepository";
import { Images4kRepository } from "infrastructure/database/repository/Image4kRepository";

export class GetImagesFromRequestUseCase {
	constructor(
		private cowRepository: ICowRepository,
		private images4KRepository: Images4kRepository,
	) {}

	async execute(idFolder: string, farmName: string, userId: string): Promise<any> {
		return await this.cowRepository.getUrlFromRequest(idFolder, farmName, userId);
	}

	// async getHistorico2(idUser: any): Promise<any> {
	// 	const historico = await this.cowRepository.getHistoricoRequest(idUser);

	// 	await Promise.all(
	// 		historico.map(async (item: any) => {
	// 			const idFolder = item.idFolder;
	// 			const totalImages =
	// 				await this.images4KRepository.countImagesByRequestIdFolder(idFolder);
	// 			item.totalImagesRequest = totalImages;
	// 		})
	// 	);

	// 	return { requests: historico };
	// }

	async getHistorico(idUser: string, farmId: string): Promise<any> {
		const historico = await this.images4KRepository.getHistoricoRequest(idUser, farmId);
		return { requests: historico };
	}


}
