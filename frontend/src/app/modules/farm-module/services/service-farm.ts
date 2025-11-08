import { Injectable } from '@angular/core';
import { environmentDev } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
	InputDTOCreateFarm,
	InputDTODeleteFarm,
	InputDTOGetFarmById,
	InputDTOGetFarmByName,
	InputDTOUpdateFarm,
	OutputDTOCreateFarm,
	OutputDTODeleteFarm,
	OutputDTOGetFarmById,
	OutputDTOGetFarmByName,
	OutputDTOListFarms,
	OutputDTOUpdateFarm,
} from '../../../core/entities/farm-entities';
import { OutputDTOListUsers } from '../../../core/entities/user-entities';

@Injectable({
	providedIn: 'root',
})
export class ServiceFarm {
	private createFarmUrl = `${environmentDev.URL_BACKEND}/farm/create`;
	private updateFarmUrl = `${environmentDev.URL_BACKEND}/farm/update`;
	private getFarmByIdUrl = `${environmentDev.URL_BACKEND}/farm/getById`;
	private getFarmByNameUrl = `${environmentDev.URL_BACKEND}/farm/getByName`;
	private getAllFarmUrl = `${environmentDev.URL_BACKEND}/farm/getAll`;
	private deleteFarmUrl = `${environmentDev.URL_BACKEND}/farm/delete`;
	private getUserForResponsesFArmUrl = `${environmentDev.URL_BACKEND}/user/getAll`;

	constructor(private http: HttpClient) {}

	createFarm(data: InputDTOCreateFarm): Observable<OutputDTOCreateFarm> {
		try {
			return this.http.post<OutputDTOCreateFarm>(
				this.createFarmUrl,
				data
			);
		} catch (error) {
			throw new Error('Erro servico createFarm', error as any);
		}
	}
	updateFarm(data: InputDTOUpdateFarm): Observable<OutputDTOUpdateFarm> {
		try {
			return this.http.put<OutputDTOUpdateFarm>(this.updateFarmUrl, data);
		} catch (error) {
			throw new Error('Erro servico updateFarm', error as any);
		}
	}
	getFarmById(data: InputDTOGetFarmById): Observable<OutputDTOGetFarmById> {
		try {
			const urlFull = `${this.getFarmByIdUrl}/${data.id}`;
			return this.http.get<OutputDTOGetFarmById>(urlFull);
		} catch (error) {
			throw new Error('Erro servico getFarmById', error as any);
		}
	}
	getFarmByName(
		data: InputDTOGetFarmByName
	): Observable<OutputDTOGetFarmByName> {
		try {
			const urlFull = `${this.getFarmByNameUrl}/${data.name}`;
			return this.http.get<OutputDTOGetFarmByName>(urlFull);
		} catch (error) {
			throw new Error('Erro servico getFarmByName', error as any);
		}
	}
	getAllFarm(): Observable<OutputDTOListFarms> {
		try {
			return this.http.get<OutputDTOListFarms>(this.getAllFarmUrl);
		} catch (error) {
			throw new Error('Erro servico getAllFarm', error as any);
		}
	}

	deleteFarm(data: InputDTODeleteFarm): Observable<OutputDTODeleteFarm> {
		try {
			const urlFull = `${this.deleteFarmUrl}/${data.id}`;
			return this.http.delete<OutputDTODeleteFarm>(urlFull);
		} catch (error) {
			throw new Error('Erro servico deleteFarm', error as any);
		}
	}

	getAllUserResponsavelFarm(): Observable<OutputDTOListUsers> {
		try {
			return this.http.get<OutputDTOListUsers>(this.getUserForResponsesFArmUrl);
		} catch (error: any) {
			throw new Error('Erro service getAllUser', error);
		}
	}
}
