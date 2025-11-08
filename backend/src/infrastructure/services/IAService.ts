import { IPayloadSendQueue } from "application/modules/image4k/useCase/UploadImagesUseCase";
import { RabbitProducer } from "./rabbit/producerRabbit";

export interface IIAService {
	sendImagesForProcessing(payload: IPayloadSendQueue): Promise<void>;
}

export class IAService implements IIAService {
	async sendImagesForProcessing(payload: IPayloadSendQueue): Promise<void> {
		const producer = new RabbitProducer();
		await producer.connect();
		const jsonPayload = JSON.stringify(payload);
		await producer.sendToQueue(jsonPayload);
		await producer.close();
	}
}

