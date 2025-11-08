import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import {
	ResponseUrls,
	UploadService,
} from '../../../modules/useCase-module/resultados/services/upload-service';
import { ServiceNotification } from '../../services/notification/service-notification';

@Component({
	selector: 'app-upload',
	imports: [CommonModule],
	templateUrl: './upload.html',
	styleUrls: ['./upload.css'],
})
export class Upload {
	isUploading = false;
	@Output() uploadCompleted = new EventEmitter<{
		bucketName: string;
		subBucketName?: string[];
	}>();

	constructor(
		private serviceNotification: ServiceNotification,
		private uploadService: UploadService
	) {}

	async uploadFolder(files: FileList | null) {
		if (!files?.length) {
			this.serviceNotification.info(
				'Nenhum arquivo',
				'Selecione um arquivo para upload.'
			);
			return;
		}

		this.isUploading = true;
		const startTime = Date.now();
		const subfolders = this.groupFilesBySubfolder(files);
		const bucketName: string = `temp-${Date.now()}`;

		try {
			await firstValueFrom(this.uploadService.createBucket(bucketName));

			// ✅ Criar array de subBucketNames de forma segura ANTES do paralelo
			const subfoldersArray = Object.values(subfolders);
			const subBucketNames = subfoldersArray.map(
				(_, index) => `folder-${index}`
			);

			// Agora os uploads podem acontecer em paralelo
			const uploadPromises = subfoldersArray.map(
				async (folderFiles, index) => {
					const fileNames = folderFiles.map((f) => f.name);
					const formData = this.createFormData(folderFiles);

					const subBucketName = subBucketNames[index];

					// Agora só solicita URLs, não tenta criar bucket
					const response = await firstValueFrom(
						this.uploadService.getUrlfromMinIo(
							fileNames,
							bucketName,
							subBucketName
						)
					);

					await this.uploadToMinio(
						formData,
						response.bucketName,
						response.urls
					);
				}
			);

			await Promise.all(uploadPromises);

			const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);

			this.serviceNotification.success(
				'Upload Completo',
				`Todos os arquivos foram enviados em ${elapsedTime} segundos.`
			);

			this.uploadCompleted.emit({
				bucketName: bucketName,
				subBucketName: subBucketNames,
			});
		} catch (error) {
			this.serviceNotification.error(
				'Erro de Upload',
				'Ocorreu um erro durante o processo de upload.'
			);
			console.error('Erro no upload:', error);
		} finally {
			this.isUploading = false;
		}
	}

	clearInput(event: Event): void {
		(event.target as HTMLInputElement).value = '';
	}

	private generateRootFolderId(): string {
		const date = new Date();
		return `${date.getDate()}-${
			date.getMonth() + 1
		}-${date.getFullYear()}-${date.getHours()}-${date.getMinutes()}-${Date.now()}`;
	}

	private groupFilesBySubfolder(files: FileList): Record<string, File[]> {
		const subfolders: Record<string, File[]> = {};

		Array.from(files).forEach((file) => {
			const pathParts = file.webkitRelativePath.split('/');

			if (pathParts.length >= 2) {
				const subfolderPath = `${pathParts[0]}/${pathParts[1]}`;
				subfolders[subfolderPath] = subfolders[subfolderPath] || [];
				subfolders[subfolderPath].push(file);
			}
		});

		return subfolders;
	}

	private createFormData(files: File[]): FormData {
		const formData = new FormData();
		files.forEach((file) => formData.append('images', file, file.name));
		return formData;
	}

	private async uploadToMinio(
		formData: FormData,
		bucketName: string,
		urls: string[]
	): Promise<void> {
		const images = formData.getAll('images') as File[];

		if (urls.length !== images.length) {
			throw new Error(
				'O número de URLs não corresponde ao número de arquivos.'
			);
		}

		const uploadPromises = images.map(async (file) => {
			const presignedUrl = urls.find((url) => url.includes(file.name));

			if (!presignedUrl) {
				throw new Error(
					`Nenhuma URL pré-assinada encontrada para o arquivo ${file.name}.`
				);
			}

			await firstValueFrom(
				this.uploadService.uploadImagesMinio(file, presignedUrl)
			);
		});

		await Promise.all(uploadPromises);
	}
}
