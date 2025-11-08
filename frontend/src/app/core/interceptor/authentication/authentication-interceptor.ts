import { Injectable } from '@angular/core';
import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { AuthenticateService } from '../../../modules/auth-module/services/authenticate/service-authenticate';
import { ServiceNotification } from '../../../shared/services/notification/service-notification';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	private isRefreshing = false;
	private refreshTokenSubject = new BehaviorSubject<boolean>(false);

	constructor(
		private authService: AuthenticateService,
		private serviceNotification: ServiceNotification
	) {}

	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		// Todas as requisições enviam cookies
		const clonedReq = req.clone({
			withCredentials: true,
		});

		return next.handle(clonedReq).pipe(
			catchError((error: HttpErrorResponse) => {
				if (
					error.status === 401 &&
					!req.url.includes('/auth/refresh-token') &&
					!req.url.includes('/auth/login')
				) {
					return this.handle401Error(clonedReq, next);
				}
				return throwError(() => error);
			})
		);
	}

	private handle401Error(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		if (!this.isRefreshing) {
			this.isRefreshing = true;
			this.refreshTokenSubject.next(false);

			// 🔁 Chama a rota de refresh token (que usa cookie HttpOnly)
			return this.authService.refreshToken().pipe(
				switchMap(() => {
					// ✅ Refresh feito com sucesso
					this.refreshTokenSubject.next(true);

					// Reenvia a requisição original
					return next.handle(
						req.clone({
							withCredentials: true,
						})
					);
				}),
				catchError((error) => {
					// ❌ Refresh falhou: sessão expirada
					this.serviceNotification.error(
						'Sessão expirada',
						'Por favor, faça login novamente.'
					);
					this.authService.logout(); // redireciona para login
					return throwError(() => error);
				}),
				finalize(() => {
					this.isRefreshing = false;
				})
			);
		} else {
			// ⏳ Aguarda o refresh em andamento
			return this.refreshTokenSubject.pipe(
				filter((refreshed) => refreshed === true),
				take(1),
				switchMap(() =>
					next.handle(
						req.clone({
							withCredentials: true,
						})
					)
				)
			);
		}
	}
}
