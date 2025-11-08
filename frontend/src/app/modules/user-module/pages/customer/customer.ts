import { Component, OnInit } from '@angular/core';
import {
	Column,
	Row,
	TableComponent,
} from '../../../../shared/components-primeNG/table/table';
import { DialogComponent } from '../../../../shared/components-primeNG/dialog/dialog';
import { ServiceConfirmation } from '../../../../shared/services/confimation/service-confirmation';
import { Panel } from 'primeng/panel';
import {
	FormConfig,
	FormData,
	InputGroup,
	SelectOption,
} from '../../../../shared/components-primeNG/input-group/input-group';
import { UserFacade } from './facade';
import { ButtonComponent } from '../../../../shared/components-primeNG/button/button';

@Component({
	selector: 'app-customer',
	imports: [
		InputGroup,
		TableComponent,
		Panel,
		DialogComponent,
		ButtonComponent,
	],
	standalone: true,
	templateUrl: './customer.html',
	styleUrl: './customer.css',
})
export class Customer implements OnInit {
	constructor(
		private serviceConfirmation: ServiceConfirmation,
		private userFacade: UserFacade
	) {}

	headerDialogCreateUser: string = '';
	isEditMode = false;
	isCreateMode = false;
	data: Row[] = [];
	loading = false;
	showMoreButton = true;
	selectfarmOptions: SelectOption[] = [];

	customerFormConfigCreate: FormConfig = {
		showName: true,
		placeholderName: 'Nome do Usuário',
		showEmail: true,
		placeholderEmail: 'Email do Usuário',
		showPassword: true,
		placeholderPassword: 'Senha do Usuário',
		showTypeUser: true,
		placeholderTypeUser: 'Tipo do Usuário',
		showAccessUser: true,
		placeholderAccessUser: 'Acesso do Usuário',

		showSelectMenu: true,
		placeholderSelectMenu: 'Selecione uma Fazenda',

		placeholderSubmitButton: 'Enviar',
	};

	customerFormConfigUpdate = {
		...this.customerFormConfigCreate,
		showEmail: false,
		showPassword: false,
	};

	customerDataCreate: FormData = {
		name: '',
		email: '',
		password: '',
		selectedType: undefined,
		selectedAccess: undefined,
		selectMenu: undefined,
	};

	customerDataUpdate: FormData = {
		name: '',
		email: '',
		password: '',
		selectedType: undefined,
		selectedAccess: undefined,
		selectMenu: undefined,
	};

	customerTypes = [
		{ name: 'Desenvolvedor', value: 'dev' },
		{ name: 'Administrador', value: 'admin' },
		{ name: 'Cliente', value: 'client' },
	];

	customerAccess = [
		{ name: 'Ativo', value: 'ativo' },
		{ name: 'Negado', value: 'negado' },
	];

	ngOnInit(): void {
		this.userFacade
			.getUsersSelectFormOptions()
			.subscribe((farms: SelectOption[]) => {
				this.selectfarmOptions = farms;
				this.selectfarmOptions.push({ name: 'Nenhum', value: undefined });
				this.loadUsers();
			});
	}

	loadUsers() {
		this.loading = true;

		this.userFacade.getAllUserFacade(this.selectfarmOptions).subscribe({
			next: (users) => {
				this.data = users.map((u) => {
					// define as ações padrão
					const actions = [];

					// se o user **não for dev**, adiciona ações
					if (u['type'] !== 'dev') {
						actions.push(
							{
								tooltip: 'Editar',
								icon: 'pi pi-fw pi-pencil',
								iconClass: 'warning',
								command: () => this.editUser(u),
							},
							{
								tooltip: 'Excluir',
								icon: 'pi pi-fw pi-trash',
								iconClass: 'error',
								command: () => this.deleteUser(u),
							}
						);
					}

					return {
						...u,
						actions,
					};
				});

				this.loading = false;
			},
			error: () => (this.loading = false),
		});
	}

	onSubmit(data: any) {
		if (this.isEditMode) {
			this.userFacade.updateUserFacade(data).subscribe(() => {
				this.loadUsers();
				this.isEditMode = false;
			});
		} else {
			this.userFacade.createUserFacade(data).subscribe(() => {
				this.customerDataCreate = {
					name: '',
					email: '',
					password: '',
					selectedType: undefined,
					selectedAccess: undefined,
				};
				this.loadUsers();
				this.isCreateMode = false;
			});
		}

		this.isEditMode = false;
	}

	editUser(row: Row) {
		this.customerDataUpdate = {
			id: row['id'] as string,
			name: row['name'] as string,
			email: row['email'] as string,
			password: '',
			selectedType: this.customerTypes.find(
				(type) => type.value === row['type']
			),
			selectedAccess: this.customerAccess.find(
				(acc) => acc.value === row['access']
			),
			selectMenu: this.selectfarmOptions.find(
				(farm) => farm.name === row['farm']
			),
		};
		this.headerDialogCreateUser = `Editar Usuário: ${row['name']}`;
		this.isEditMode = true;
	}

	deleteUser(row: Row) {
		this.serviceConfirmation.confirm({
			header: 'Excluir Usuário',
			message: `Deseja excluir ${row['name']}?`,
			accept: () => {
				this.userFacade.deleteUserFacade(row).subscribe(() => {
					this.loadUsers();
				});
			},
		});
	}

	refresh() {
		this.loadUsers();
	}

	showDialog() {
		this.headerDialogCreateUser = 'Cadastrar Novo Usuário';
		this.isEditMode = false;
		this.isCreateMode = true;
	}

	columns: Column[] = [
		{
			field: 'name',
			header: 'Nome',
			type: 'text',
			sortable: true,
			filterable: true,
			visible: true,
			showToUser: true,
		},
		{
			field: 'email',
			header: 'Email',
			type: 'text',
			sortable: false,
			filterable: false,
			visible: true,
			showToUser: true,
		},

		{
			field: 'updatedAt',
			header: 'Atualizado em',
			type: 'datetime',
			sortable: true,
			filterable: true,
			visible: true,
			showToUser: false,
		},
		{
			field: 'type',
			header: 'Tipo',
			type: 'text',
			sortable: true,
			filterable: false,
			visible: true,
			showToUser: true,
			fraction: 0.5,
		},
		{
			field: 'access',
			header: 'Acesso',
			type: 'text',
			sortable: false,
			filterable: false,
			visible: true,
			showToUser: true,
			fraction: 0.5,
		},
		{
			field: 'farm',
			header: 'Fazenda',
			type: 'text',
			sortable: false,
			filterable: false,
			visible: true,
			showToUser: true,
		},
		{
			field: 'createdAt',
			header: 'Criado em',
			type: 'datetime',
			sortable: true,
			filterable: true,
			visible: true,
			showToUser: true,
		},
	];
}
