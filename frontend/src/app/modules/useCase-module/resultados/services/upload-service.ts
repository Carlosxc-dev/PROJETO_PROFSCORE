import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environmentDev } from '../../../../environments/environments';

export interface ResponseUrls {
	urls: string[];
	bucketName: string;
}

@Injectable({
	providedIn: 'root',
})
export class UploadService {
	private uploadUrl = `${environmentDev.URL_BACKEND}/image4k/uploadImages`;
	private getImagesUrl = `${environmentDev.URL_BACKEND}/cow/getImages`;
	private getHistoricoRequestsUrl = `${environmentDev.URL_BACKEND}/cow/getHistorico`;
	private geturlminio = `${environmentDev.URL_BACKEND}/image4k/getUrlFromMinIo`;
	private urlCreateBucket = `${environmentDev.URL_BACKEND}/image4k/createBucketIfNotExists`;

	constructor(private http: HttpClient) {}

	uploadImages(bucketName: string, subBucketName: string[]): Observable<any> {
		return this.http.post<any>(this.uploadUrl, {
			bucketName,
			subBucketName,
		});
	}

	createBucket(bucketName: string): Observable<any> {
		return this.http.post(this.urlCreateBucket, {
			bucketName,
		});
	}

	getUrls(farm: string, folder: string, user: string): Observable<any> {
		const url = `${this.getImagesUrl}/${farm}/${folder}/${user}`;
		return this.http.get(url);
	}

	getRequisicoesFeitasV2(userId: string, farmId: string): Observable<any> {
		const url = `${this.getHistoricoRequestsUrl}/${userId}/${farmId}`;
		return this.http.get(url);
	}

	dowloadImageMinio(url: string): Observable<Blob> {
		return this.http.get(url, { responseType: 'blob' });
	}

	uploadImagesMinio(file: File, presignedUrl: string): Observable<any> {
		return this.http.put(presignedUrl, file, {
			headers: new HttpHeaders({
				'Content-Type': file.type,
			}),
			responseType: 'text' as 'json',
		});
	}

	getUrlfromMinIo(
		fileNames: string[],
		bucketName: string,
		subBucketName: string
	): Observable<ResponseUrls> {
		return this.http.post<ResponseUrls>(this.geturlminio, {
			fileNames,
			bucketName,
			subBucketName,
		});
	}
}
