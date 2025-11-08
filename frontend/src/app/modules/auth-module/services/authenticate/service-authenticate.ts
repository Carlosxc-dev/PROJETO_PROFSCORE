import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
	Observable,
	tap,
	catchError,
	throwError,
	BehaviorSubject,
	of,
} from 'rxjs';
import { environmentDev } from '../../../../environments/environments';
import { Router } from '@angular/router';
import { Access } from '../../../../core/enums/access';

export interface inputDTOLogin {
	email: string;
	password: string;
}

export interface User {
	id: string;
	name: string;
	email: string;
	type: string; // Exemplo: 'adm', 'client', 'dev'
	access: string;
	farmId: string | null;
}

export interface LoginResponse {
	message: string;
	user: User;
}

export interface LogoutResponse {
	message: string;
}

export interface RefreshTokenResponse {
	message: string;
}

@Injectable({
	providedIn: 'root',
})
export class AuthenticateService {
	private authLoginUrl = `${environmentDev.URL_BACKEND}/auth/login`;
	private authLogoutUrl = `${environmentDev.URL_BACKEND}/auth/logout`;
	private authRefreshTokenUrl = `${environmentDev.URL_BACKEND}/auth/refresh-token`;

	// BehaviorSubject para gerenciar estado do usuário
	private userSubject = new BehaviorSubject<User | null>(null);
	public user$ = this.userSubject.asObservable();

	constructor(private http: HttpClient, private router: Router) {
		// Verifica se há usuário salvo no sessionStorage (não sensível)
		const savedUser = sessionStorage.getItem('user');
		if (savedUser) {
			this.userSubject.next(JSON.parse(savedUser));
		}
	}

	/**
	 * Realiza o login do usuário
	 * TOKENS ARMAZENADOS COMO COOKIES HTTPONLY (SEGURO)
	 */
	// login(data: inputDTOLogin): Observable<LoginResponse> {
	// 	return this.http
	// 		.post<LoginResponse>(this.authLoginUrl, data, {
	// 			withCredentials: false, // CRÍTICO: Envia e recebe cookies
	// 		})
	// 		.pipe(
	// 			tap((response: LoginResponse) => {
	// 				// Armazena apenas informações não sensíveis do usuário
	// 				sessionStorage.setItem('user', JSON.stringify(response.user));
	// 				this.userSubject.next(response.user);

	// 			}),
	// 			tap(() => {
	// 				if(this.userSubject.value?.access === Access.negado){
	// 					this.router.navigate(['/login']);
	// 					throw new Error('Acesso negado. Contate o administrador.');
	// 				}
	// 				this.router.navigate(['/main/welcome']);
	// 			}),
	// 			catchError((error) => {
	// 				return throwError(() => error);
	// 			})
	// 		);
	// }
	login(data: inputDTOLogin): Observable<any> {
		const user: User = {
			id: '123',
			name: 'Carlos Henrique',
			email: 'carlos@gmail.com',
			type: 'dev',
			access: 'ativo',
			farmId: 'uuid-fazenda-exemplo',
		};
		sessionStorage.setItem('user', JSON.stringify(user));
		this.userSubject.next(user);
		this.router.navigate(['/main/welcome']);

		return of(true);
	}

	/**
	 * Realiza o logout do usuário
	 * Backend extrai refreshToken do cookie automaticamente
	 */
	// logout(): Observable<LogoutResponse> {
	// 	return this.http
	// 		.post<LogoutResponse>(this.authLogoutUrl, {
	// 			withCredentials: false,
	// 		})
	// 		.pipe(
	// 			tap(() => {
	// 				sessionStorage.removeItem('user');
	// 				this.userSubject.next(null);
	// 			}),
	// 			tap(() => {
	// 				this.router.navigate(['/login']);
	// 			}),
	// 			catchError((error) => {
	// 				// Mesmo com erro, limpa dados locais
	// 				sessionStorage.removeItem('user');
	// 				this.userSubject.next(null);
	// 				this.router.navigate(['/login']);
	// 				return throwError(() => error);
	// 			})
	// 		);
	// }
	logout(): Observable<LogoutResponse> {
		sessionStorage.removeItem('user');
		this.userSubject.next(null);
		this.router.navigate(['/login']);

		return of({ message: 'Logout successful' });
	}

	/**
	 * Atualiza o accessToken usando o refreshToken
	 * Backend extrai refreshToken do cookie e retorna novo token como cookie
	 */
	refreshToken(): Observable<RefreshTokenResponse> {
		return this.http
			.post<RefreshTokenResponse>(
				this.authRefreshTokenUrl,
				{}, // Body vazio - backend usa cookie
				{ withCredentials: false }
			)
			.pipe(
				tap((response: RefreshTokenResponse) => {
					console.log('Token atualizado com sucesso');
				}),
				catchError((error) => {
					console.error('Erro ao atualizar token:', error);
					// Se falhar ao renovar, faz logout
					sessionStorage.removeItem('user');
					this.userSubject.next(null);
					this.router.navigate(['/login']);
					return throwError(() => error);
				})
			);
	}

	/**
	 * Verifica se o usuário está autenticado
	 * Como os tokens estão em cookies HttpOnly, fazemos uma requisição ao backend
	 */
	checkAuthentication(): Observable<{ authenticated: boolean }> {
		// Opção 1: Endpoint de validação
		return this.http
			.get<{ authenticated: boolean }>(
				`${environmentDev.URL_BACKEND}/auth/validate`,
				{ withCredentials: false }
			)
			.pipe(
				tap((response) => {
					if (!response.authenticated) {
						this.userSubject.next(null);
						sessionStorage.removeItem('user');
					}
				}),
				catchError(() => {
					this.userSubject.next(null);
					sessionStorage.removeItem('user');
					return throwError(() => new Error('Not authenticated'));
				})
			);
	}

	/**
	 * Obtém o usuário atual
	 */
	getCurrentUser(): User | null {
		return this.userSubject.value?.type ? this.userSubject.value : null;
	}

	/**
	 * Verifica se há usuário logado (baseado em dados locais)
	 */
	isLoggedIn(): boolean {
		return this.userSubject.value !== null;
	}
}
