import {
	Component,
	EventEmitter,
	HostListener,
	Input,
	OnInit,
	Output,
	output,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { Router, RouterLink } from '@angular/router';
import { AuthRolesService } from '../../../core/guard/authorization/authorization-guard';
import { AuthenticateService } from '../../../modules/auth-module/services/authenticate/service-authenticate';
import { ServiceNotification } from '../../services/notification/service-notification';
import { Button } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-menu-template',
	imports: [
		MenuModule,
		BadgeModule,
		RippleModule,
		AvatarModule,
		Menu,
		RouterLink,
		Button,
		CommonModule,
	],
	templateUrl: './menu-template.html',
	styleUrl: './menu-template.css',
})
export class MenuTemplate implements OnInit {
	items: MenuItem[] = [];
	isDarkMode: boolean = true;
	labelTheme: string = 'Escuro';
	@Input() isMobileViewMenu: boolean = false;

	constructor(
		private router: Router,
		private authRolesService: AuthRolesService,
		private authenticateService: AuthenticateService,
		private serviceNotification: ServiceNotification
	) {}

	ngOnInit() {
		const type = this.authRolesService.getCurrentUserType();

		if (!type) {
			// Se não houver tipo, redireciona para login
			this.router.navigate(['/login']);
			throw new Error(
				'Tipo de usuário não definido. Redirecionando para login.'
			);
		}

		this.items = [
			{ separator: true, style: { margin: '50px' } },
			this.homeMenu(),
			...(this.canSeeConfig(type) ? [this.configMenu()] : []),
			...(this.canSeeConfigDev(type) ? [this.devMenu()] : []),
			this.documentationMenu(),
			{ separator: true, style: { margin: '50px' } },
			this.logoutMenu(),
		];
	}

	toggleDarkMode() {
		const element = document.querySelector('html');
		element!.classList.toggle('toggleTheme');
		this.isDarkMode = element!.classList.contains('toggleTheme');
		this.labelTheme = this.isDarkMode ? 'Claro' : 'Escuro';
	}

	// Menu Home
	private homeMenu(): MenuItem {
		return {
			label: 'Serviços',
			items: [
				{
					label: 'Professores',
					icon: 'pi pi-users',
					disabled: false,
					command: () => this.router.navigate(['/main/results']),
				},
				{
					label: 'Avaliar',
					icon: 'pi pi-star',
					command: () => this.router.navigate(['/main/results']),
				},
			],
		};
	}

	// Menu Configurações (Admin ou Dev)
	private configMenu(): MenuItem {
		return {
			label: 'Configurações',
			items: [
				{
					label: 'Relatórios',
					icon: 'pi pi-briefcase',
					command: () => this.router.navigate(['/main/metric']),
				},
				{
					label: 'Usuarios',
					icon: 'pi pi-users',
					command: () => this.router.navigate(['/main/customer']),
				},
			],
		};
	}

	// Menu Documentação
	private devMenu(): MenuItem {
		return {
			label: 'Desenvolvimento',
			items: [
				{
					label: 'Teste',
					icon: 'pi pi-cog',
					command: () => this.router.navigate(['/main/teste-dev']),
				},
			],
		};
	}
	private documentationMenu(): MenuItem {
		return {
			label: 'Documentação',
			items: [
				{
					label: 'Ajuda',
					icon: 'pi pi-question',
					command: () => this.router.navigate(['/main/help']),
				},
			],
		};
	}

	private logoutMenu(): MenuItem {
		return {
			label: '',
			items: [
				{
					label: 'Sair',
					icon: 'pi pi-sign-out ',
					iconClass: 'error',
					command: () => {
						this.authenticateService.logout().subscribe({
							next: () => {
								this.serviceNotification.success(
									'Sucesso!',
									'Você saiu do sistema.'
								);
								this.router.navigate(['/login']);
							},
							error: (err) => {
								this.serviceNotification.error(
									'Erro!',
									err.error.message ||
										'Não foi possível sair do sistema.'
								);
								this.router.navigate(['/login']);
							},
						});
					},
				},
			],
		};
	}

	private canSeeConfig(role: string): boolean {
		return role === 'admin' || role === 'dev';
	}

	private canSeeConfigDev(role: string): boolean {
		return role === 'dev';
	}
}
