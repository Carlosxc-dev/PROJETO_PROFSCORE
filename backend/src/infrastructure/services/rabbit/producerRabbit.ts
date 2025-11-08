import amqp from "amqplib";
import { IPayloadSendQueue } from "application/modules/image4k/useCase/UploadImagesUseCase";
import msgpack from "msgpack-lite";
import { v4 as randomUUID } from "uuid";

export class RabbitProducer {
	private connection: any = null;
	private channel: any = null;

	private readonly queueSend = "processar_imagem";
	private readonly queueReceive = "resposta_imagem";
	private readonly url = process.env.RABBITMQ_URL || "amqp://root:root@rabbitmq:5672";

	async connect(): Promise<void> {
		if (this.connection && this.channel) return;

		this.connection = await amqp.connect(this.url);
		this.channel = await this.connection.createChannel();

		await this.channel.assertQueue(this.queueSend, { durable: true });

		console.log("🚀 RabbitMQ Producer conectado à fila:", this.queueSend);
	}

	async sendToQueue(data: string): Promise<void> {
		if (!this.channel) await this.connect();

		const buffer = Buffer.from(data, "utf-8");
		console.log("data to send:", data);
		this.channel!.sendToQueue(this.queueSend, buffer, {
			persistent: true,
		});
		console.log("📨 Mensagem enviada para fila:", this.queueSend);
	}

	async close(): Promise<void> {
		await this.channel.close();
		await this.connection.close();
		console.log("🔌 Conexão RabbitMQ Producer encerrada");
	}
}
