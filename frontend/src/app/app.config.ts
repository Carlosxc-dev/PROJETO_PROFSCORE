import {
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideZoneChangeDetection,
} from '@angular/core';

import {
	provideHttpClient,
	withInterceptorsFromDi,
} from '@angular/common/http';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptor/authentication/authentication-interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';

const MyPreset = definePreset(Aura, {
	semantic: {
		primary: {
			50: '{blue.50}',
			100: '{blue.100}',
			200: '{blue.200}',
			300: '{blue.300}',
			400: '{blue.400}',
			500: '{blue.500}',
			600: '{blue.600}',
			700: '{blue.700}',
			800: '{blue.800}',
			900: '{blue.900}',
			950: '{blue.950}',
		},
		secondary: {
			50: '{cyan.50}',
			100: '{cyan.100}',
			200: '{cyan.200}',
			300: '{cyan.300}',
			400: '{cyan.400}',
			500: '{cyan.500}',
			600: '{cyan.600}',
			700: '{cyan.700}',
			800: '{cyan.800}',
			900: '{cyan.900}',
			950: '{cyan.950}',
		},

		colorScheme: {
			light: {
				semantic: {
					highlight: {
						background: '{primary.50}',
						color: '{primary.700}',
					},
				},
				formField: {
					hoverBorderColor: '{primary.color}',
				},
			},
			dark: {
				semantic: {
					highlight: {
						background: '{primary.900}',
						color: '{primary.900}',
					},
				},
				formField: {
					hoverBorderColor: '{primary.color}',
				},
			},
		},
	},
});

export const appConfig: ApplicationConfig = {
	providers: [
		provideHttpClient(withInterceptorsFromDi()),
		{ provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
		JwtHelperService,
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
		provideBrowserGlobalErrorListeners(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideAnimations(),
		MessageService,
		ConfirmationService,
		providePrimeNG({
			ripple: true,
			theme: {
				preset: MyPreset,
				options: {
					darkModeSelector: '.toggleTheme',
				},
			},
		}),
	],
};
