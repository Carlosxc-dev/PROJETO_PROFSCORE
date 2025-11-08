import { ErrorHandler } from "api/error/ErrorHandler";
import { IBuffers } from "application/modules/image4k/useCase/UploadImagesUseCase";
import FormData from "form-data";
import { sendImagesFormDataToRabbit } from "./RabiMqService";

export interface IIAService {
	getImagesClassifyFromIA(images4K: IBuffers[]): Promise<{ [fileName: string]: Buffer } | null>;
}

export class IAService implements IIAService {
	async getImagesClassifyFromIA(
		images4K: IBuffers[]
	): Promise<{ [fileName: string]: Buffer } | null> {
		const formData = new FormData();

		images4K.forEach((file) => {
			formData.append("images4k", file.buffer, {
				filename: file.originalname,
				contentType: file.mimetype,
			});
		});

		const files: { [fileName: string]: Buffer } = await sendImagesFormDataToRabbit(images4K);
		if (!files) {
			return null;
		}

		return files;
	}

	async sendImagesForProcessing(
		images4K: IBuffers[],
		root_folder_id: string,
		path_save_images: string
	): Promise<void> {
		const connection = await amqp.connect(
			process.env.RABBITMQ_URL || "amqp://root:root@rabbitmq:5672"
		);
		const channel = await connection.createChannel();

		const requestQueue = "processar_imagem";

		const images = images4K.map((file) => ({
			filename: file.originalname,
			buffer: file.buffer,
		}));

		const payload = {
			root_folder_id,
			path_save_images,
			images,
		};

		// serializa com msgpack (ou JSON se preferir)
		const packed = msgpack.encode(payload);

		channel.sendToQueue(requestQueue, packed, {
			persistent: true, // garante que a mensagem não se perde se o Rabbit cair
		});

		console.log("📤 Enviado para RabbitMQ:", requestQueue);
		await channel.close();
		await connection.close();
	}
}

