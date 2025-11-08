import { Component, OnInit } from '@angular/core';

import { Panel } from 'primeng/panel';
import { ServiceConfirmation } from '../../../../shared/services/confimation/service-confirmation';
import { ServiceFarm } from '../../services/service-farm';
import {
	Column,
	Row,
	TableComponent,
} from '../../../../shared/components-primeNG/table/table';
import {
	FormConfig,
	FormData,
	InputGroup,
} from '../../../../shared/components-primeNG/input-group/input-group';
import { Action } from '../../../../shared/components-primeNG/table/action-button/action-button';
import { FarmFacade } from './facade';
import { ConfirmDialogComponent } from '../../../../shared/components-primeNG/confirm-dialog/confirm-dialog';
import { DialogComponent } from '../../../../shared/components-primeNG/dialog/dialog';
import { ButtonComponent } from '../../../../shared/components-primeNG/button/button';

@Component({
	selector: 'app-farm',
	imports: [
		InputGroup,
		TableComponent,
		Panel,
		DialogComponent,
		ButtonComponent,
	],
	templateUrl: './farm.html',
	styleUrl: './farm.css',
})
export class Farm implements OnInit {
	constructor(
		private serviceConfirmation: ServiceConfirmation,
		private farmFacade: FarmFacade
	) {}

	headerDialogCreateFarm: string = '';
	isEditMode = false;
	isCreateMode = false;
	data: Row[] = [];
	loading = false;
	showMoreButton = true;
	customerTypes: any = [];

	farmFormConfig: FormConfig = {
		showName: true,
		placeholderName: 'Nome da Fazenda',
		showEmail: true,
		placeholderEmail: 'Email do Responsável',
		showAddressCity: true,
		placeholderAddressCity: 'Cidade da Fazenda',
		showAddressState: true,
		placeholderAddressState: 'Estado da Fazenda',
		placeholderSubmitButton: 'Enviar',
	};

	farmData: FormData = {
		name: '',
		email: '',
		addressCity: '',
		addressState: '',
	};

	farmFormConfigUpdate: FormConfig = {
		...this.farmFormConfig,
		placeholderSubmitButton: 'Enviar',
		showEmail: false,
		showPassword: false,
	};

	farmDataUpdate: FormData = {
		name: '',
		email: '',
		addressCity: '',
		addressState: '',
	};

	ngOnInit(): void {
		// Load users for the dropdown
		this.farmFacade.getUsersTypeFacade().subscribe((users: any[]) => {
			this.customerTypes = users;
		});
		this.loadFarms();
	}

	loadFarms() {
		this.loading = true;
		this.farmFacade.getAllFarmFacade().subscribe({
			next: (farm) => {
				this.data = farm.map((u) => ({
					...u,

					email:
						this.customerTypes.find((type: any) =>
							type.farms?.includes(u['id'])
						)?.name || '------',

					actions: [
						{
							tooltip: 'Editar',
							icon: 'pi pi-fw pi-pencil',
							iconClass: 'warning',
							command: () => this.editFarm(u),
						},
						{
							tooltip: 'Excluir',
							icon: 'pi pi-fw pi-trash',
							iconClass: 'error',
							command: () => this.deleteFarm(u),
						},
					],
				}));
				this.loading = false;
			},
			error: () => (this.loading = false),
		});
	}

	onSubmit(data: any) {
		if (this.isEditMode) {
			this.farmFacade.updateFarmFacade(data).subscribe(() => {
				this.loadFarms();
				this.isEditMode = false;
			});
		} else {
			this.farmFacade.createFarmFacade(data).subscribe(() => {
				this.farmData = {
					name: '',
					email: '',
					password: '',
					selectedType: undefined,
					selectedAccess: undefined,
				};
				this.loadFarms();
				this.isCreateMode = false;
			});
		}

		this.isEditMode = false;
	}

	editFarm(row: Row) {
		this.farmDataUpdate = {
			id: row['id'] as string,
			name: row['name'] as string,
			addressCity: row['city'] as string,
			addressState: row['state'] as string,
			coordinatesLatitude: row['latitude'] as string,
			coordinatesLongitude: row['longitude'] as string,
			license: row['license'] as string,
		};

		this.headerDialogCreateFarm = `Editar Usuário: ${row['name']}`;
		this.isEditMode = true;
	}

	deleteFarm(row: Row) {
		this.serviceConfirmation.confirm({
			header: 'Excluir Usuário',
			message: `Deseja excluir ${row['name']}?`,
			accept: () => {
				this.farmFacade.deleteFarmFacade(row).subscribe(() => {
					this.loadFarms();
				});
			},
		});
	}

	refresh() {
		this.loadFarms();
	}

	showDialog() {
		this.headerDialogCreateFarm = 'Cadastrar Nova Fazenda';
		this.isEditMode = false;
		this.isCreateMode = true;
	}

	columns: Column[] = [
		{
			field: 'name',
			header: 'Name',
			type: 'text',
			sortable: true,
			filterable: true,
			visible: true,
			showToUser: true,
		},
		{
			field: 'email',
			header: 'Responsável',
			type: 'text',
			sortable: false,
			filterable: false,
			visible: true,
			showToUser: true,
		},
		{
			field: 'city',
			header: 'Cidade',
			type: 'text',
			sortable: false,
			filterable: false,
			visible: true,
			showToUser: true,
		},
		{
			field: 'state',
			header: 'Estado',
			type: 'text',
			sortable: false,
			filterable: false,
			visible: true,
			showToUser: true,
		},
		{
			field: 'longitude',
			header: 'Longitude',
			type: 'text',
			sortable: false,
			filterable: false,
			visible: false,
			showToUser: false,
		},
		{
			field: 'latitude',
			header: 'Latitude',
			type: 'text',
			sortable: false,
			filterable: false,
			visible: false,
			showToUser: false,
		},
		{
			field: 'license',
			header: 'Licença',
			type: 'text',
			sortable: false,
			filterable: false,
			visible: false,
			showToUser: false,
		},
		{
			field: 'feedlots',
			header: 'Fazenda',
			type: 'text',
			sortable: false,
			filterable: false,
			visible: false,
			showToUser: false,
		},
		{
			field: 'createdAt',
			header: 'Criado Em',
			type: 'text',
			sortable: false,
			filterable: false,
			visible: true,
			showToUser: true,
		},
	];
}
