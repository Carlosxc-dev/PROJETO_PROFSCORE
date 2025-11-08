// input-group.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';

export interface SelectOption {
	name: string;
	value?: any;
}

export interface FormConfig {
	//geral
	showName?: boolean;
	placeholderName?: string;
	showEmail?: boolean;
	placeholderEmail?: string;
	placeholderSubmitButton?: string;

	showSelectMenu?: boolean;
	placeholderSelectMenu?: string;

	//user
	showPassword?: boolean;
	placeholderPassword?: string;
	showTypeUser?: boolean;
	placeholderTypeUser?: string;
	showAccessUser?: boolean;
	placeholderAccessUser?: string;

	//fazenda
	showAddressCity?: boolean;
	placeholderAddressCity?: string;
	showAddressState?: boolean;
	placeholderAddressState?: string;
	showCoordinatesLatitude?: boolean;
	placeholderCoordinatesLatitude?: string;
	showCoordinatesLongitude?: boolean;
	placeholderCoordinatesLongitude?: string;
	showlicense?: boolean;
	placeholderLicense?: string;

	//baia
	haveUpload?: boolean;
}

export interface FormData {
	//geral
	id?: string;
	name?: string;
	email?: string;

	selectMenu?: SelectOption;

	// user
	password?: string;
	selectedType?: SelectOption;
	selectedAccess?: SelectOption;

	// fazenda
	addressCity?: string;
	addressState?: string;
	coordinatesLatitude?: string;
	coordinatesLongitude?: string;
	license?: string;

	// baia ja tem tudo acima
	haveUpload?: boolean;
}

@Component({
	selector: 'app-input-group',
	imports: [
		FormsModule,
		InputGroupModule,
		InputGroupAddonModule,
		InputTextModule,
		SelectModule,
		InputNumberModule,
		PasswordModule,
		FloatLabelModule,
		ButtonModule,
		CommonModule,
		FileUploadModule,
	],
	templateUrl: './input-group.html',
	styleUrl: './input-group.css',
})
export class InputGroup {
	@Input() config: FormConfig = {
		//geral
		showName: false,
		placeholderName: '',
		showEmail: false,
		placeholderEmail: '',
		placeholderSubmitButton: '',

		showSelectMenu: false,
		placeholderSelectMenu: '',

		//user
		showPassword: false,
		placeholderPassword: '',
		showTypeUser: false,
		placeholderTypeUser: '',
		showAccessUser: false,
		placeholderAccessUser: '',

		//fazenda
		showAddressCity: false,
		placeholderAddressCity: '',
		showAddressState: false,
		placeholderAddressState: '',
		showCoordinatesLatitude: false,
		placeholderCoordinatesLatitude: '',
		showCoordinatesLongitude: false,
		placeholderCoordinatesLongitude: '',
		showlicense: false,
		placeholderLicense: '',

		//upload
		haveUpload: false,
	};

	@Input() typeOptions?: SelectOption[] = [];
	@Input() accessOptions?: SelectOption[] = [];

	@Input() selectOptions?: SelectOption[] = [];

	@Input() formData: FormData = {};
	@Output() formDataChange = new EventEmitter<FormData>();
	@Output() onSubmit = new EventEmitter<FormData>();

	loading: boolean = false;

	updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
		this.formData[key] = value;
		this.formDataChange.emit(this.formData);
	}

	load() {
		this.loading = true;
		this.onSubmit.emit(this.formData);

		setTimeout(() => {
			this.loading = false;
		}, 2000);
	}

	fields = [
		{
			show: () => this.config.showName,
			icon: 'pi pi-user',
			control: 'name' as const,
			type: 'text',
			placeholder: () => this.config.placeholderName,
		},
		{
			show: () => this.config.showEmail,
			icon: 'pi pi-envelope',
			control: 'email' as const,
			type: 'email',
			placeholder: () => this.config.placeholderEmail,
		},
		{
			show: () => this.config.showPassword,
			icon: 'pi pi-lock',
			control: 'password' as const,
			type: 'password',
			label: () => this.config.placeholderPassword,
		},
		{
			show: () => this.config.showTypeUser,
			icon: 'pi pi-users',
			control: 'selectedType' as const,
			options: () => this.typeOptions,
			placeholder: () => this.config.placeholderTypeUser,
		},
		{
			show: () => this.config.showSelectMenu,
			icon: 'pi pi-list',
			control: 'selectMenu' as const,
			options: () => this.selectOptions,
			placeholder: () => this.config.placeholderSelectMenu,
		},
		{
			show: () => this.config.showAccessUser,
			icon: 'pi pi-key',
			control: 'selectedAccess' as const,
			options: () => this.accessOptions,
			placeholder: () => this.config.placeholderAccessUser,
		},
		//fazenda
		{
			show: () => this.config.showAddressCity,
			icon: 'pi pi-home',
			control: 'addressCity' as const,
			type: 'text',
			placeholder: () => this.config.placeholderAddressCity,
		},
		{
			show: () => this.config.showAddressState,
			icon: 'pi pi-home',
			control: 'addressState' as const,
			type: 'text',
			placeholder: () => this.config.placeholderAddressState,
		},
		{
			show: () => this.config.showlicense,
			icon: 'pi pi-id-card',
			control: 'license' as const,
			type: 'text',
			placeholder: () => this.config.placeholderLicense,
		},
		{
			show: () => this.config.showCoordinatesLatitude,
			icon: 'pi pi-map-marker',
			control: 'coordinatesLatitude' as const,
			type: 'text',
			placeholder: () => this.config.placeholderCoordinatesLatitude,
		},
		{
			show: () => this.config.showCoordinatesLongitude,
			icon: 'pi pi-map-marker',
			control: 'coordinatesLongitude' as const,
			type: 'text',
			placeholder: () => this.config.placeholderCoordinatesLongitude,
		},
		{
			show: () => this.config.haveUpload,
			icon: 'pi pi-upload',
			control: 'haveUpload' as const,
			type: 'file',
			placeholder: () => this.config.placeholderCoordinatesLongitude,
		},
	];
}
