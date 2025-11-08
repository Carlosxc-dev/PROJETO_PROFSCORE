// core/websocket/websocket.ts
import { Injectable } from '@angular/core';
import { Observable, Subject, filter, map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class Websocket {
	private ws!: WebSocket;
	private messageSubject = new Subject<any>();
	private url: string;
	private connectionSubject = new Subject<boolean>();

	constructor() {
		this.url = 'ws://localhost:9090';
	}

	public connect(): void {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.connectionSubject.next(true);
			return;
		}

		this.ws = new WebSocket(this.url);

		this.ws.onopen = () => {
			console.log('✅ Conectado ao WebSocket');
			this.connectionSubject.next(true); // Notifica que conectou
		};

		this.ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				this.messageSubject.next(data);
			} catch (e) {
				this.messageSubject.next(event.data);
			}
		};

		this.ws.onerror = (error) => {
			console.error('❌ Erro no WebSocket:', error);
		};

		this.ws.onclose = () => {
			console.log('🔌 WebSocket desconectado');
		};
	}

	public onConnect(): Observable<boolean> {
		return this.connectionSubject.asObservable();
	}

	public getHistorico(userId: string, farmId: string): void {
		this.send('getHistorico', { userId, farmId });
	}

	private send(type: string, data: any = {}): void {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			const message = JSON.stringify({ type, data });
			this.ws.send(message);
			console.log(`📤 Enviado [${type}]:`, data);
		} else {
			console.error('WebSocket não conectado');
		}
	}

	public sendMessage(data: any): void {
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			const message =
				typeof data === 'string' ? data : JSON.stringify(data);
			this.ws.send(message);
			console.log('📤 Mensagem enviada:', message);
		} else {
			console.error('WebSocket não está conectado');
		}
	}

	public onMessage(): Observable<any> {
		return this.messageSubject.asObservable();
	}

	public close(): void {
		if (this.ws) {
			this.ws.close();
		}
	}

	public isConnected(): boolean {
		return this.ws && this.ws.readyState === WebSocket.OPEN;
	}
}
