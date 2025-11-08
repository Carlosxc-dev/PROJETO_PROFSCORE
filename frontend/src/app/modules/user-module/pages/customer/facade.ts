import { Injectable } from '@angular/core';
import { UserService } from '../../services/UserService';
import { Row } from '../../../../shared/components-primeNG/table/table';
import { Observable, map, tap } from 'rxjs';
import { ServiceNotification } from '../../../../shared/services/notification/service-notification';
import { ServiceFarm } from '../../../farm-module/services/service-farm';
import { SelectOption } from '../../../../shared/components-primeNG/input-group/input-group';

@Injectable({
	providedIn: 'root',
})
export class UserFacade {
	constructor(
		private userService: UserService,
		private serviceNotification: ServiceNotification,
		private farmService: ServiceFarm
	) {}

	createUserFacade(data: any): Observable<any> {
		const dto = {
			name: data.name,
			email: data.email,
			password: data.password,
			type: data.selectedType.value,
			access: data.selectedAccess.value,
			farmId: data.selectMenu?.value
		};
		return this.userService.createUser(dto).pipe(
			tap({
				next: () => {
					this.serviceNotification.success(
						'Sucesso!',
						'Usuário cadastrado com sucesso!'
					);
				},
				error: (error: any) => {
					this.serviceNotification.error(
						'Erro!',
						error.error.message ||
							'Não foi possível cadastrar o usuário!'
					);
				},
			})
		);
	}

	updateUserFacade(data: any): Observable<any> {
		const dto: {
			id: string;
			name: any;
			type: any;
			access: any;
			farmId?: any;
		} = {
			id: data.id as string,
			name: data.name,
			type: data.selectedType.value,
			access: data.selectedAccess.value,			
		};

		if(data.selectfarmOptions?.value !== undefined){
			dto.farmId = data.selectMenu?.value
		}

		return this.userService.updateUser(dto).pipe(
			tap({
				next: () => {
					this.serviceNotification.success(
						'Sucesso!',
						'Usuário atualizado com sucesso!'
					);
				},
				error: (error: any) => {
					this.serviceNotification.error(
						'Erro!',
						error.error.message ||
							'Não foi possível atualizar o usuário!'
					);
				},
			})
		);
	}

	deleteUserFacade(row: Row): Observable<any> {
		return this.userService.deleteUser({ id: row['id'] as string }).pipe(
			tap({
				next: () => {
					this.serviceNotification.success(
						'Sucesso!',
						'Usuário excluído com sucesso!'
					);
				},
				error: (erro: any) => {
					this.serviceNotification.error(
						'Erro!',
						erro.error.message ||
							'Não foi possível excluir o usuário!'
					);
				},
			})
		);
	}

	getAllUserFacade(selectfarmOptions: SelectOption[]): Observable<Row[]> {
		return this.userService.getAllUser().pipe(
			map((response) =>
				response.users.map((user: any) => {
					const matchOptionsFarms = selectfarmOptions.find(
						(option) => option.value === user.farmId
					);

					user.farms = matchOptionsFarms
						? [matchOptionsFarms.name]
						: ['------'];

					return this.mapDatatoRow(user);
				})
			),
			tap({
				error: (erro: any) => {
					this.serviceNotification.error(
						'Erro!',
						erro.error.message ||
							'Não foi possível carregar os usuários!'
					);
				},
			})
		);
	}

	getUserByIdFacade(id: string): Observable<any> {
		return this.userService.getUserById({ id }).pipe(
			map((response) => {
				return this.mapDatatoRow(response.user);
			}),
			tap({
				error: (erro: any) => {
					this.serviceNotification.error(
						'Erro!',
						erro.error.message ||
							'Não foi possível carregar o usuário!'
					);
				},
			})
		);
	}

	getUsersSelectFormOptions(): Observable<SelectOption[]> {
		return this.farmService.getAllFarm().pipe(
			map((response) => {
				console.log(response);

				return response.farms.map((farm: any) => ({
					name: farm.name,
					value: farm.id,
				}));
			}),
			tap({
				error: (erro: any) => {
					this.serviceNotification.error(
						'Erro!',
						erro.error.message ||
							'Não foi possível carregar as fazendas!'
					);
				},
			})
		);
	}

	private mapDatatoRow(data: any): Row {
		return {
			id: data.id,
			name: data.name,
			email: data.email,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			type: data.type,
			access: data.access,
			farm: data.farm ?? data.farms[0],
			actions: [],
		};
	}
}
