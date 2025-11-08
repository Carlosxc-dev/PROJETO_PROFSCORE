// src/services/MinioService.ts
import { Client, BucketItem } from "minio";

interface IBuffers {
	buffer: Buffer; // o conteúdo do arquivo
	originalname: string; // nome do arquivo
	mimetype?: string; // tipo mime (opcional)
}

export interface IMinioService {
	uploadBuffers(bucketName: string, buffers: IBuffers[]): Promise<boolean>;
	createBucket(bucketName: string): Promise<boolean>;
	uploadFile(bucketName: string, objectName: string, filePath: string): Promise<void>;
	downloadFile(bucketName: string, objectName: string, destPath: string): Promise<void>;
	makeBucketPublic(bucketName: string): Promise<void>;
	deleteFile(bucketName: string, objectName: string): Promise<void>;
	getPresignedUrl(bucketName: string, fileName: string): Promise<string>;
	getImageAndMetadata(
		bucket: string,
		objectName: string
	): Promise<{ buffer: Buffer; metadata: any }>;
	deleteBucket(bucketName: string): Promise<void>;
	deleteAllBuckets(): Promise<void>;
	isBucketExists(bucketName: string): Promise<boolean>;
	listFiles(bucketName: string, subBucketName?: string, subSubBucketName?: string): Promise<string[]>
}

export class MinioService implements IMinioService {
	private client: Client;
	private endpointUrl: string; // usado para construir URLs públicas
	private useSSL: boolean = process.env.MINIO_USE_SSL === "true";
	private port: number = parseInt(process.env.MINIO_PORT || "9000", 10);
	private endPoint: string = process.env.MINIO_ENDPOINT || "localhost";
	private accessKey: string = process.env.MINIO_ACCESS_KEY || "admin";
	private secretKey: string = process.env.MINIO_SECRET_KEY || "admin12345";

	constructor() {
		this.client = new Client({
			endPoint: this.endPoint,
			port: this.port,
			useSSL: this.useSSL,
			accessKey: this.accessKey,
			secretKey: this.secretKey,
		});

		this.endpointUrl = `${this.useSSL ? "https" : "http"}://${this.endPoint}:${this.port}`;
	}

	async isBucketExists(bucketName: string): Promise<boolean> {
		return await this.client.bucketExists(bucketName);
	}

	// Cria um bucket se não existir
	async createBucket(bucketName: string): Promise<boolean> {
		const exists = await this.client.bucketExists(bucketName);
		if (!exists) {
			await this.client.makeBucket(bucketName, "us-east-1");
			console.log(`Bucket "${bucketName}" criado com sucesso!`);
			return true
		}
		return false;
	}

	// Torna o bucket público
	async makeBucketPublic(bucketName: string): Promise<void> {
		const policy = {
			Version: "2012-10-17",
			Statement: [
				{
					Effect: "Allow",
					Principal: { AWS: ["*"] },
					Action: ["s3:GetObject"],
					Resource: [`arn:aws:s3:::${bucketName}/*`],
				},
			],
		};

		await this.client.setBucketPolicy(bucketName, JSON.stringify(policy));
	}

	// Envia um arquivo local para o bucket
	async uploadFile(bucketName: string, objectName: string, filePath: string): Promise<void> {
		await this.client.fPutObject(bucketName, objectName, filePath);
		console.log(`Arquivo "${objectName}" enviado para o bucket "${bucketName}".`);
	}

	// Baixa um arquivo do bucket para o local
	async downloadFile(bucketName: string, objectName: string, destPath: string): Promise<void> {
		await this.client.fGetObject(bucketName, objectName, destPath);
		console.log(`Arquivo "${objectName}" baixado para "${destPath}".`);
	}

	// Lista todos os objetos do bucket
	async listFiles(bucketName: string, subBucketName?: string, subSubBucketName?: string): Promise<string[]> {
		return new Promise((resolve, reject) => {
			const urls: string[] = [];

			let prefix = ""
			if (subBucketName && subSubBucketName) prefix = `${subBucketName}/${subSubBucketName}`

			const stream = this.client.listObjects(bucketName, prefix, true);

			
			stream.on("data", (obj) => {
				if (obj.name) {
					// Monta a URL pública do arquivo
					const url = `http://${this.endPoint}:${this.port}/${bucketName}/${obj.name}`;
					urls.push(url);
				}
			});
			
			console.log("urls: ", urls)
			stream.on("end", () => resolve(urls));
			stream.on("error", (err) => reject(err));
		});
	}

	// Remove um arquivo do bucket
	async deleteFile(bucketName: string, objectName: string): Promise<void> {
		await this.client.removeObject(bucketName, objectName);
		console.log(`Arquivo "${objectName}" removido do bucket "${bucketName}".`);
	}

	// delete bucket
	async deleteBucket(bucketName: string): Promise<void> {
		await this.client.removeBucket(bucketName);
		console.log(`Bucket "${bucketName}" removido com sucesso!`);
	}

	async uploadBuffers(bucketName: string, buffers: IBuffers[]): Promise<boolean> {
		await this.createBucket(bucketName);
		await this.makeBucketPublic(bucketName);

		for (const file of buffers) {
			const objectName = `${Date.now()}-${file.originalname}`;
			await this.client.putObject(bucketName, objectName, file.buffer);
		}

		if (buffers.length === 0) {
			return false;
		}

		return true;
	}

	async deleteAllBuckets(): Promise<void> {
		const buckets = await this.client.listBuckets();
		for (const bucket of buckets) {
			const objectsStream = this.client.listObjects(bucket.name, "", true);
			const objects: string[] = [];
			objectsStream.on("data", (obj) => {
				objects.push(obj.name!);
			});
			await new Promise((resolve, reject) => {
				objectsStream.on("end", resolve);
				objectsStream.on("error", reject);
			});
			if (objects.length > 0) {
				await this.client.removeObjects(bucket.name, objects);
			}
			await this.client.removeBucket(bucket.name);
			console.log(`Bucket "${bucket.name}" e seus objetos foram removidos.`);
		}
	}

	async getPresignedUrl(bucketName: string, fileName: string): Promise<string> {
		// Expiração de 10 minutos
		const time_expiration_url = 600;
		const url = await this.client.presignedPutObject(bucketName, fileName, time_expiration_url); // 600 segundos = 10 minutos
		return url;
	}

	// Pega a imagem e metadados
	async getImageAndMetadata(bucket: string, objectName: string) {
		try {
			// 1️⃣ Obter os metadados
			const stat = await this.client.statObject(bucket, objectName);
			console.log("Metadados:", stat.metaData);

			// 2️⃣ Obter o objeto
			const stream = await this.client.getObject(bucket, objectName);

			const chunks: Buffer[] = [];
			for await (const chunk of stream) {
				chunks.push(chunk as Buffer);
			}

			const fileBuffer = Buffer.concat(chunks);
			console.log("Arquivo carregado, tamanho:", fileBuffer.length);

			return {
				buffer: fileBuffer,
				metadata: stat.metaData,
			};
		} catch (err) {
			console.error("Erro ao buscar imagem do MinIO:", err);
			throw err;
		}
	}
}
