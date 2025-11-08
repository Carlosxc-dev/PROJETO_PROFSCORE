// WebSocketService.ts
import { GetImagesFromRequestUseCase } from "application/modules/cow/useCase/getImagesFromRequestUseCase";
import { WebSocketServer, WebSocket } from "ws";
import { da } from "zod/v4/locales";

export interface IDataMessage {
	type: string;
	data?: any;
}
interface IDataHandleMessage {
	type: string;
	userId: string;
	farmId: string;
}

export class WebSocketService {
	private wss!: WebSocketServer;
	private clients: Set<WebSocket>;
	private port: number;

	constructor(port = 9090, private getImagesFromRequestUseCase: GetImagesFromRequestUseCase) {
		this.port = port;
		this.clients = new Set();
		this.initServer();
	}

	private initServer() {
		this.wss = new WebSocketServer({ port: this.port });
		console.log(`🚀 Servidor WebSocket rodando em ws://localhost:${this.port}`);

		this.wss.on("connection", (ws: WebSocket, req) => {
			const clientIp = req.socket.remoteAddress;

			this.clients.add(ws);

			ws.on("message", (message: string | Buffer) => {
				const msgString = message.toString();

				try {
					const parsed: IDataHandleMessage = JSON.parse(msgString);
					this.handleMessage(ws, parsed);
				} catch (e) {
					console.log("⚠️  Mensagem não é JSON válido");
				}
			});

			ws.on("close", () => {
				this.clients.delete(ws);
			});

			ws.on("error", (err) => {
				console.error("🔥 Erro no cliente:", err);
			});
		});

		this.wss.on("error", (err) => {
			console.error("🔥 Erro no servidor WebSocket:", err);
		});
	}

	public async broadcast(data: IDataMessage) {
		if (data.type === "updateHistoricoResponse") {
			const url = await this.getImagesFromRequestUseCase.getHistorico(data.data.userId, data.data.farmId)
			this.clients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify({ type: "updateHistoricoResponse", data: url }) );
				}
			});
		}

	}

	protected async handleMessage(ws: WebSocket, message: IDataHandleMessage) {
		switch (message.type) {
			case "getHistorico":
				const url = await this.getImagesFromRequestUseCase.getHistorico(message.userId, message.farmId)
				this.sendToClient(ws, { type: "getHistoricoResponse", data: url });
				break;

			default:
				console.log("⚠️  Tipo de mensagem desconhecido:", message.type);
		}
	}

	// Método para enviar mensagem para um cliente específico
	public sendToClient(ws: WebSocket, data: IDataMessage) {
		if (ws.readyState === WebSocket.OPEN) {
			const message = typeof data === "string" ? data : JSON.stringify(data);
			console.log("📤 Enviando para cliente específico:", message);
			ws.send(message);
		}
	}

	// Método para listar todos os clientes conectados
	public getConnectedClients(): number {
		return this.clients.size;
	}

	public close() {
		console.log("🛑 Fechando servidor WebSocket...");
		this.wss.close(() => console.log("✅ Servidor WebSocket fechado"));
	}
}
