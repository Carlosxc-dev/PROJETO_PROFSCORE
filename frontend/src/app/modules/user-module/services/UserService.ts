import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environmentDev } from '../../../environments/environments';
import {
	InputDTOCreateUser,
	InputDTODeleteUser,
	InputDTOGetUserById,
	InputDTOUpdateUser,
	OutputDTOCreateUser,
	OutputDTODeleteUser,
	OutputDTOGetUserById,
	OutputDTOListUsers,
	OutputDTOUpdateUser,
} from '../../../core/entities/user-entities';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private createUserUrl = `${environmentDev.URL_BACKEND}/user/create`;
	private updateUserUrl = `${environmentDev.URL_BACKEND}/user/update`;
	private getUserByIdUrl = `${environmentDev.URL_BACKEND}/user/getById`;
	private getAllUserUrl = `${environmentDev.URL_BACKEND}/user/getAll`;
	private deleteUserUrl = `${environmentDev.URL_BACKEND}/user/delete`;
	private getReportUrl = `${environmentDev.URL_BACKEND}/user/report`;

	constructor(private http: HttpClient) {}

	createUser(data: InputDTOCreateUser): Observable<OutputDTOCreateUser> {
		try {
			return this.http.post<OutputDTOCreateUser>(
				this.createUserUrl,
				data
			);
		} catch (error: any) {
			throw new Error('Erro service createUser', error);
			
		}
	}
	updateUser(data: InputDTOUpdateUser): Observable<OutputDTOUpdateUser> {
		try {
			return this.http.put<OutputDTOUpdateUser>(
				this.updateUserUrl,
				data
			);
		} catch (error: any) {
			throw new Error('Erro service updateUser', error);
		}
	}
	getUserById(data: InputDTOGetUserById): Observable<OutputDTOGetUserById> {
		try {
			const urlFull = `${this.getUserByIdUrl}/${data.id}`;
			return this.http.get<OutputDTOGetUserById>(urlFull);
		} catch (error: any) {
			throw new Error('Erro service getUserById', error);
		}
	}
	getAllUser(): Observable<OutputDTOListUsers> {
		try {
			return this.http.get<OutputDTOListUsers>(this.getAllUserUrl);
		} catch (error: any) {
			throw new Error('Erro service getAllUser', error);
		}
	}
	deleteUser(data: InputDTODeleteUser): Observable<OutputDTODeleteUser> {
		try {
			return this.http.delete<OutputDTODeleteUser>(
				`${this.deleteUserUrl}/${data.id}`
			);
		} catch (error: any) {
			throw new Error('Erro service deleteUser', error);
		}
	}

	getReport(): Observable<any> {
		try {
			return this.http.get(this.getReportUrl, {
				responseType: 'json',
			});
		} catch (error: any) {
			throw new Error('Erro service getReport', error);
		}
	}
}
