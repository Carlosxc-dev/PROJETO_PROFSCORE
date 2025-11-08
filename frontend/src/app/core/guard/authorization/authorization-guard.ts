// auth-roles.service.ts
import { Injectable } from '@angular/core';
import {
	AuthenticateService,
	User,
} from '../../../modules/auth-module/services/authenticate/service-authenticate';
import { Observable, map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AuthRolesService {
	constructor(private authenticateService: AuthenticateService) {}

	/**
	 * Retorna o tipo/role do usuário como Observable
	 * Assume que User tem uma propriedade 'type' ou 'role'
	 */
	get type(): Observable<string | null> {
		return this.authenticateService.user$.pipe(
			map((user: User | null) => {
				// Ajuste conforme a propriedade real do User
				// Se User tem 'role', use: return user?.role ?? null;
				// Se User tem 'type', use: return user?.type ?? null;
				return (user as any)?.type ?? null;
			})
		);
	}

	/**
	 * Verifica se o usuário atual é administrador
	 */
	isAdmin(): Observable<boolean> {
		return this.type.pipe(map((userType) => userType === 'adm'));
	}

	/**
	 * Verifica se o usuário atual é cliente
	 */
	isUser(): Observable<boolean> {
		return this.type.pipe(map((userType) => userType === 'client'));
	}

	/**
	 * Verifica se o usuário atual é desenvolvedor
	 */
	isDev(): Observable<boolean> {
		return this.type.pipe(map((userType) => userType === 'dev'));
	}

	/**
	 * Versão síncrona - obtém o tipo do usuário atual diretamente
	 */
	getCurrentUserType(): string | null {
		const user = this.authenticateService.getCurrentUser();
		return (user as any)?.type ?? null;
	}

	/**
	 * Versão síncrona - verifica se é admin
	 */
	isAdminSync(): boolean {
		return this.getCurrentUserType() === 'adm';
	}

	/**
	 * Versão síncrona - verifica se é cliente
	 */
	isUserSync(): boolean {
		return this.getCurrentUserType() === 'client';
	}

	/**
	 * Versão síncrona - verifica se é desenvolvedor
	 */
	isDevSync(): boolean {
		return this.getCurrentUserType() === 'dev';
	}
}
