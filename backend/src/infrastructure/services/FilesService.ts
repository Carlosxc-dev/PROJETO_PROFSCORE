import fs from "fs";
import exifParser from "exif-parser";
import path from "path";
import multer, { Multer } from "multer";

export interface IFilesService {
	getFilesFromRoutes(): Promise<any>;
	getLongLatFromImage(filePath: string): IInfosImage | null;
	createFolder(folderPath: string): void;
	createFiles(folderPath: string, files: string[]): void;
	getFileBuffer(filePath: string): Buffer;
	getBasePath(filePath: string): string;
	getFilesFromRoutes(): Promise<any>;
	getLongLatFromBuffer(buffer: Buffer): any;
	countFilesInDirectory(directoryPath: string): number;
	getAllFilesInDirectory(directoryPath: string): string[];
	getDirectoryUrls(rootPath: string): DirectoryResponse;
	getDirectoryUrlsFromParams(
		farmName: string,
		rootFolderId: string,
		feedlotName: string
	): DirectoryResponse;
	getFilesFromFeedlot(farmName: string, timestamp: string, feedlotName: string): any;
	getTimestampFromFarmName(farmName: string): string[];
	saveFilesFromRabbit(folderPath: string, files: { [fileName: string]: Buffer<ArrayBufferLike> }): void;
}

export interface IInfosImage {
	latitude: number;
	longitude: number;
	altitude?: number;
	dateTimeOriginal?: Date;
	serialNumber?: string;
}

interface BaiaInfo {
	name: string;
	files: string[];
}

interface DirectoryResponse {
	root: string;
	folderTimestamp: string;
	baias: BaiaInfo[];
}

export class FilesService implements IFilesService {
	constructor(private pathFilesFromSystem: string = "./uploads") {}

	getLongLatFromImage(filePath: string): IInfosImage | null {
		try {
			const buffer = fs.readFileSync(filePath);
			const parser = exifParser.create(buffer);
			const result = parser.parse();

			const latitude = result.tags.GPSLatitude;
			const longitude = result.tags.GPSLongitude;
			const altitude = result.tags.GPSAltitude;
			const dateTimeOriginal =
				typeof result.tags.DateTimeOriginal === "number"
					? new Date(result.tags.DateTimeOriginal * 1000)
					: undefined;

			const serialNumber = result.tags.serialNumber;

			if (latitude !== undefined && longitude !== undefined) {
				return {
					latitude: latitude as number,
					longitude: longitude as number,
					altitude: altitude as number | undefined,
					dateTimeOriginal: dateTimeOriginal as Date | undefined,
					serialNumber: serialNumber as string | undefined,
				};
			}

			return null;
		} catch (error) {
			// console.error("Error reading EXIF data:", error);
			return null;
		}
	}

	async getFilesFromRoutes(): Promise<any> {
		const storage = multer.memoryStorage(); // <-- armazena em memória
		return multer({ storage });
	}

	getLongLatFromBuffer(buffer: Buffer): IInfosImage | null {
		try {
			const parser = exifParser.create(buffer);
			const result = parser.parse();

			const gps = result.tags;

			const latitude = (gps.GPSLatitude as number) ?? (gps.latitude as number);
			const longitude = (gps.GPSLongitude as number) ?? (gps.longitude as number);

			if (!latitude || !longitude) return null;

			return { latitude, longitude };
		} catch (err) {
			// se o buffer não tiver metadados ou for inválido
			return null;
		}
	}

	async getFilesFromRoutes2(): Promise<any> {
		const pad = (n: number) => n.toString().padStart(2, "0");

		const storage = multer.diskStorage({
			destination: (req, file, cb) => {
				// Verifica se já existe um caminho definido para esta requisição
				if (!req.uploadPath) {
					const date = new Date();
					req.uploadPath = path.join(
						this.pathFilesFromSystem,
						`${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}-${pad(date.getHours())}-${pad(date.getMinutes())}-${Date.now()}`
					);

					if (!fs.existsSync(req.uploadPath)) {
						fs.mkdirSync(req.uploadPath, { recursive: true });
					}
				}

				cb(null, req.uploadPath);
			},
			filename: (req, file, cb) => {
				cb(null, Date.now() + "-" + file.originalname);
			},
		});

		return multer({ storage });
	}

	createFolder(folderPath: string): void {
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath, { recursive: true });
		}
	}

	saveFilesFromRabbit(folderPath: string, files: { [fileName: string]: Buffer<ArrayBufferLike> }): void {
		// Garante que a pasta existe
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath, { recursive: true });
		}

		// Cria um arquivo para cada buffer
		for (const [fileName, fileBuffer] of Object.entries(files)) {
			const destinationPath = path.join(folderPath, fileName);
			fs.writeFileSync(destinationPath, fileBuffer);
		}
	}

	createFiles(folderPath: string, files: string[]): void {
		files.forEach((filePath) => {
			const fileName = path.basename(filePath);
			const destinationPath = path.join(folderPath, fileName);
			fs.copyFileSync(filePath, destinationPath);
		});
	}

	getFileBuffer(filePath: string): Buffer {
		return fs.readFileSync(filePath);
	}

	getBasePath(filePath: string): string {
		return path.dirname(filePath);
	}

	countFilesInDirectory(directoryPath: string): number {
		if (!fs.existsSync(directoryPath)) {
			// Retorna 0 se a pasta não existir
			return 0;
		}

		const files = fs.readdirSync(directoryPath);
		return files.filter((item) => fs.statSync(path.join(directoryPath, item)).isFile()).length;
	}

	// vou passar um path dir e a funcao devera retornar uma lista string com todos os arquivos dentro deste path
	getAllFilesInDirectory(directoryPath: string): string[] {
		if (!fs.existsSync(directoryPath)) {
			// Diretório não existe, retorna array vazio
			return [];
		}

		const files = fs.readdirSync(directoryPath);
		// Retorna apenas arquivos (não subpastas)
		return files
			.filter((file) => fs.statSync(path.join(directoryPath, file)).isFile())
			.map((file) => path.join(directoryPath, file));
	}

	getDirectoryUrls(rootPath: string): DirectoryResponse {
		// Valida se o path existe
		if (!fs.existsSync(rootPath)) {
			throw new Error(`Path does not exist: ${rootPath}`);
		}

		// Valida se é um diretório
		const stats = fs.statSync(rootPath);
		if (!stats.isDirectory()) {
			throw new Error(`Path is not a directory: ${rootPath}`);
		}

		// Extrai informações do path
		const pathParts = rootPath.split(path.sep);
		const folderTimestamp = pathParts[pathParts.length - 2]; // Pega o timestamp
		const rootFolder = pathParts.slice(0, -2).join(path.sep); // Remove o último nível (confinamento)

		const baias: BaiaInfo[] = [];

		// Lista os itens no diretório raiz
		const items = fs.readdirSync(rootPath);

		for (const item of items) {
			const itemPath = path.join(rootPath, item);
			const itemStats = fs.statSync(itemPath);

			// Se for uma pasta, considera como uma baia
			if (itemStats.isDirectory()) {
				const files: string[] = [];

				// Lista todos os arquivos dentro da baia
				const baiaItems = fs.readdirSync(itemPath);

				for (const file of baiaItems) {
					const filePath = path.join(itemPath, file);
					const fileStats = fs.statSync(filePath);

					// Adiciona apenas arquivos (ignora subpastas)
					if (fileStats.isFile()) {
						files.push(file);
					}
				}

				baias.push({
					name: item,
					files: files,
				});
			}
		}

		return {
			root: rootFolder.replace(/\\/g, "/"), // Normaliza barras para URLs
			folderTimestamp: folderTimestamp,
			baias: baias,
		};
	}

	/**
	 * Versão alternativa que constrói o path a partir dos parâmetros
	 */
	getDirectoryUrlsFromParams(
		farmName: string,
		rootFolderId: string,
		feedlotName: string
	): DirectoryResponse {
		const rootPath = path.join("uploads", farmName, rootFolderId, feedlotName);
		return this.getDirectoryUrls(rootPath);
	}

	getTimestampFromFarmName(farmName: string): string[] {
		const farmPath = path.join("uploads", farmName);

		if (!fs.existsSync(farmPath)) {
			return [];
		}

		const items = fs.readdirSync(farmPath);
		const timestamps: string[] = [];

		items.forEach((item) => {
			const itemPath = path.join(farmPath, item);
			if (fs.statSync(itemPath).isDirectory()) {
				timestamps.push(item);
			}
		});

		return timestamps;
	}

	getFilesFromFeedlot(farmName: string, timestamp: string) {
		const folderPath = path.join("uploads", farmName, timestamp);

		if (!fs.existsSync(folderPath)) {
			return { error: "Pasta não encontrada" };
		}

		const result: Record<string, string[]> = {};
		const items = fs.readdirSync(folderPath);

		// Percorre todas as baias
		for (const baia of items) {
			const baiaPath = path.join(folderPath, baia);
			if (fs.statSync(baiaPath).isDirectory()) {
				const subfolders = fs.readdirSync(baiaPath);

				for (const sub of subfolders) {
					const subPath = path.join(baiaPath, sub);
					if (fs.statSync(subPath).isDirectory()) {
						const files = fs.readdirSync(subPath);
						const fileUrls = files.map(
							(f) => `getImages/${farmName}/${timestamp}/${baia}/${sub}/${f}`
						);
						if (fileUrls.length > 0) result[baia] = fileUrls;
					}
				}
			}
		}

		return result;
	}
}

