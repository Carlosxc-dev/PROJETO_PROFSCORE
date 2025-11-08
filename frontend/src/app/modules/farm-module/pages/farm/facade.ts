import { Injectable } from '@angular/core';
import { Row } from '../../../../shared/components-primeNG/table/table';
import { Observable, map, tap } from 'rxjs';
import { ServiceFarm } from '../../services/service-farm';
import { ServiceNotification } from '../../../../shared/services/notification/service-notification';
import { OutputDTOListUsers } from '../../../../core/entities/user-entities';

@Injectable({
	providedIn: 'root',
})
export class FarmFacade {
	constructor(
		private farmService: ServiceFarm,
		private serviceNotification: ServiceNotification,
	) {}

	createFarmFacade(data: any): Observable<any> {
		const dto = {
			name: data.name,
			address: {
				city: data.addressCity,
				state: data.addressState,
			},
			coordinates: {
				latitude: parseFloat(data.coordinatesLatitude),
				longitude: parseFloat(data.coordinatesLongitude),
			},
			license: data.license,
		};
		return this.farmService.createFarm(dto).pipe(
			tap({
				next: () => {
					this.serviceNotification.success(
						'Sucesso!',
						'Fazenda cadastrada com sucesso!'
					);
				},
				error: (error: any) => {
					this.serviceNotification.error(
						'Erro!',
						error.error.message ||
							'Não foi possível cadastrar a fazenda!'
					);
				},
			})
		);
	}

	updateFarmFacade(data: any): Observable<any> {
		const dto = {
			id: data.id as string,
			name: data.name,
			address: {
				city: data.addressCity,
				state: data.addressState,
			},
			coordinates: {
				latitude: parseFloat(data.coordinatesLatitude),
				longitude: parseFloat(data.coordinatesLongitude),
			},
			license: data.license,
		};
		return this.farmService.updateFarm(dto).pipe(
			tap({
				next: () => {
					this.serviceNotification.success(
						'Sucesso!',
						'Fazenda atualizada com sucesso!'
					);
				},
				error: (error: any) => {
					this.serviceNotification.error(
						'Erro!',
						error.error.message ||
							'Não foi possível atualizar a fazenda!'
					);
				},
			})
		);
	}

	deleteFarmFacade(row: Row): Observable<any> {
		return this.farmService.deleteFarm({ id: row['id'] as string }).pipe(
			tap({
				next: () => {
					this.serviceNotification.success(
						'Sucesso!',
						'Fazenda excluída com sucesso!'
					);
				},
				error: (error: any) => {
					this.serviceNotification.error(
						'Erro!',
						error.error.message ||
							'Não foi possível excluir a fazenda!'
					);
				},
			})
		);
	}

	getAllFarmFacade(): Observable<Row[]> {
		return this.farmService.getAllFarm().pipe(
			map((response) => {
				return response.farms.map((farm: any) => {
					return this.mapDatatoRow(farm);
				});
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

	getFarmByIdFacade(id: string): Observable<any> {
		return this.farmService.getFarmById({ id }).pipe(
			map((response) => {
				return this.mapDatatoRow(response.farm);
			}),
			tap({
				error: (erro: any) => {
					this.serviceNotification.error(
						'Erro!',
						erro.error.message ||
							'Não foi possível carregar a fazenda!'
					);
				},
			})
		);
	}

	getUsersTypeFacade(): Observable<any[]> {
		return this.farmService.getAllUserResponsavelFarm().pipe(
			map((response: OutputDTOListUsers) => {
				return response.users.map((user: any) => ({
					name: user.name,
					value: user.id,
					farms: user.farms,
				}));
			}),
			tap({
				error: (erro: any) => {
					this.serviceNotification.error(
						'Erro!',
						erro.error.message ||
							'Não foi possível carregar os tipos de usuário!'
					);
				},
			})
		);
	}

	private mapDatatoRow(data: any): Row {
		return {
			id: data.id,
			name: data.name,
			city: data.city,
			state: data.state,
			email: data.user?.name || '------',
			latitude: data.latitude,
			longitude: data.longitude,
			license: data.license,
			feedlots: data.feedlots?.length ?? 0,
			createdAt: data.createdAt,
			actions: [],
		};
	}
}
