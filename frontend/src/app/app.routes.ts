import { Routes } from '@angular/router';
import { Metric } from './modules/useCase-module/metricas/pages/metric/metric';

import { Login } from './modules/auth-module/pages/login/login';
import { AuthenticatedGuard } from './core/guard/authenticated/authenticated-guard';
import { Customer } from './modules/user-module/pages/customer/customer';
import { Farm } from './modules/farm-module/pages/farm/farm';
import { Main } from './modules/main-module/pages/main/main';
import { Welcome } from './modules/main-module/pages/welcome/welcome';
import { TesteDev } from './modules/main-module/pages/teste-dev/teste-dev';
import { DisplayResults } from './modules/useCase-module/resultados/pages/historico/historico';
import { Help } from './modules/useCase-module/help/pages/help/help';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full',
	},
	{
		path: 'login',
		component: Login,
	},
	{
		path: 'main',
		component: Main,
		// canActivate: [AuthenticatedGuard],
		children: [
			{
				path: 'welcome',
				component: Welcome,
				// canActivate: [AuthenticatedGuard],
			},
			{
				path: 'results',
				component: DisplayResults,
				// canActivate: [AuthenticatedGuard],
			},
			{
				path: 'customer',
				component: Customer,
				// canActivate: [AuthenticatedGuard],
			},
			{
				path: 'farm',
				component: Farm,
				// canActivate: [AuthenticatedGuard],
			},
			{
				path: 'metric',
				// canActivate: [AuthenticatedGuard],
				component: Metric,
			},
			{
				path: 'teste-dev',
				// canActivate: [AuthenticatedGuard],
				component: TesteDev,
			},
			{
				path: 'help',
				// canActivate: [AuthenticatedGuard],
				component: Help,
			},
		],
	},
];
