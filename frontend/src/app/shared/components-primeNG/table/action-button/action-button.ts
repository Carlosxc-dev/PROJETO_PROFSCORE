import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { TooltipOptions } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';

@Component({
	selector: 'lib-action-button',
	imports: [CommonModule, RouterModule, TooltipModule, RippleModule],
	templateUrl: './action-button.html',
	styleUrl: './action-button.css',
})
export class ActionButtonComponent {
	@Input() action: Action | undefined;
	@Input() rowData: any;

	tooltipOptions: TooltipOptions = {
		showDelay: 100,
		hideDelay: 100,
		life: 1500,
		tooltipStyleClass: 'description text-xs',
		tooltipEvent: 'hover',
		tooltipPosition: 'top',
	};

	onClick(event: any, data: any): void {
		if (this.action && this.action.command)
			this.action.command(event, data);
	}

	getIconColor(iconClass: string | undefined): string | null {
		if (!iconClass) return null;

		const colorMap: { [key: string]: string } = {
			warning: '#f59e0b', // orange-500
			error: '#ef4444', // red-500
			success: '#10b981', // green-500
			info: '#3b82f6', // blue-500
		};

		return colorMap[iconClass] || null;
	}
}

export interface Action {
	label?: string;
	tooltip?: string;
	icon?: string;
	command: (event?: any, data?: any) => void;
	routerLink?: string;
	queryParams?: any;
	styleClass?: string;
	iconClass?: string;
}
