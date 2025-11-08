import amqp from "amqplib";
import msgpack from "msgpack-lite";
import { IAService } from "../IAService";
import { FilesService } from "../FilesService";
import { CowUseCase } from "application/modules/cow/useCase/cowUseCase";
import { State } from "core/enums/state";
import { Position } from "core/enums/position";
import { IImage4kUseCase } from "application/modules/image4k/interface/IimageUseCase";
import { StatusRequest } from "@prisma/client";
import { WebSocketService } from "../websocket/webSocketService";
import { IMinioService, MinioService } from "../minio/MinioService";

export class RabbitConsumer {
	private connection: any = null;
	private channel: any = null;
	private replyQueue: string = "";
	private correlationId: string = "";

	private readonly queueReceive = "resposta_imagem";
	private readonly url = process.env.RABBITMQ_URL || "amqp://root:root@rabbitmq:5672";

	constructor(
		private filesService: FilesService,
		private cowUseCase: CowUseCase,
		private image4kUseCase: IImage4kUseCase,
		private webSocketService: WebSocketService,
		private minioService: IMinioService
	) {}

	async connect(): Promise<void> {
		if (this.connection && this.channel) return;

		this.connection = await amqp.connect(this.url);
		this.channel = await this.connection.createChannel();
		await this.channel.assertQueue(this.queueReceive, { durable: true });

		console.log("🚀 RabbitMQ Consumer conectado à fila:", this.queueReceive);
	}

	async start(): Promise<void> {
		await this.connect();

		this.channel!.consume(
			this.queueReceive,
			async (msg: any) => {
				if (!msg) return;

				try {
					const jsonString = msg.content.toString("utf-8");
					const data = JSON.parse(jsonString);

					const responseRabbit = {
						bucketName: data.bucketName,
						subBucketName: data.subBucketName,
						subSubBucketName: data.subSubBucketName,
						userId: data.userId,
						farmId: data.farmId,
						feedlotId: data.feedlotId,
						processing_time: data.processing_time,
						images4k: {
							latitude: data.images4k.latitude,
							longitude: data.images4k.longitude,
							totalImagesRequest: data.images4k.totalImagesRequest,
							statusRequest: data.images4k.statusRequest,
						},
					};

					
					this.saveImages4kResponseIA(responseRabbit);
					this.saveCowsResponseIA(responseRabbit);
					
					this.webSocketService.broadcast({
						type: "updateHistoricoResponse",
						data: {
							userId: data.userId,
							farmId: data.farmId,
						},
					});
					
					console.log("📩 Mensagem recebida da fila:", responseRabbit);
					this.channel!.ack(msg);
				} catch (error) {
					console.error("❌ Erro ao processar mensagem:", error);
					this.channel!.nack(msg, false, false);
				}
			},
			{ noAck: false }
		);
	}

	saveCowsResponseIA(data: any) {
		this.minioService
			.listFiles(data.bucketName, data.subBucketName, data.subSubBucketName)
			.then(async (urls) => {
				await Promise.all(
					urls.map((url) =>
						this.cowUseCase.createCow({
							state: "atipico" as State,
							position: "ereto" as Position,
							feedlotId: data.feedlotId,
							idFolder: data.subBucketName,
							imageName: url,
							url_image: url,
						})
					)
				);
			})
			.catch((err) => {
				console.log("Erro : ", err);
			});
	}

	saveImages4kResponseIA(data: any) {
		this.image4kUseCase.createImage4k({
			coordinates: {
				latitude: data.images4k.latitude,
				longitude: data.images4k.longitude,
			},
			idFolder: data.subBucketName,
			userId: data.userId,
			totalImagesRequest: data.images4k.totalImagesRequest,
			feedlotId: data.feedlotId,
			statusRequest: data.images4k.statusRequest,
		});
	}

	updateStatusImage4k(idFolder: string, status: StatusRequest) {
		if (!idFolder) {
			console.error("❌ idFolder é obrigatório para atualizar o status.");
			return;
		}
		console.log("Atualizando status da Image4k. idFolder:", idFolder, "Status:", status);
		this.image4kUseCase.updateImage4kByIdFolder(idFolder, status);
	}

	async close(): Promise<void> {
		await this.channel?.close();
		await this.connection?.close();
		console.log("🔌 Conexão RabbitMQ encerrada");
	}
}
