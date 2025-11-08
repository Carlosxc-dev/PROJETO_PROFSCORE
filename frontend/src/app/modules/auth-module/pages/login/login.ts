import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';

import { AuthenticateService } from '../../services/authenticate/service-authenticate';
import { ButtonComponent } from '../../../../shared/components-primeNG/button/button';
import { InputComponent } from '../../../../shared/components-primeNG/input/input';
import { InputPasswordComponent } from '../../../../shared/components-primeNG/input-password/input-password';
import { FormData } from '../../../../shared/components-primeNG/input-group/input-group';
import { ServiceNotification } from '../../../../shared/services/notification/service-notification';

@Component({
	selector: 'app-login',
	imports: [
		FormsModule,
		CommonModule,
		ButtonComponent,
		InputComponent,
		InputPasswordComponent,
		ReactiveFormsModule,
	],
	templateUrl: './login.html',
	styleUrl: './login.css',
})
export class Login {
	userForm: FormGroup;
	constructor(
		private authenticateService: AuthenticateService,
		private serviceNotification: ServiceNotification
	) {
		this.userForm = new FormGroup({
			email: new FormControl('', {
				validators: [
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(50),
				],
				updateOn: 'blur',
			}),
			password: new FormControl(''),
		});
	}

	get email(): FormControl {
		return this.userForm.get('email') as FormControl;
	}
	get password(): FormControl {
		return this.userForm.get('password') as FormControl;
	}

	errorMessage: string = '';
	loading: boolean = false;
	formData: FormData = {
		email: '',
		password: '',
	};

	@Output() userSubmit = new EventEmitter();

	onSubmit() {
		if (this.userForm.invalid) {
			return this.userForm.markAllAsTouched();
		}

		const user = {
			email: this.email.value,
			password: this.password.value,
		};

		this.login(user);
	}

	async login(data: any) {
		this.loading = true;
		this.authenticateService
			.login({
				email: data.email,
				password: data.password,
			})
			.subscribe({
				next: (response) => {
					this.serviceNotification.success(
						'Login',
						'Login realizado com sucesso!'
					 );
					this.userSubmit.emit(response);
					this.loading = false;
				},
				error: (error) => {
					this.errorMessage = error.error?.message || 'Erro no login';
					this.serviceNotification.error('Erro', this.errorMessage);
					this.loading = false;
				},
			});
	}
}
