import { Injectable } from '@angular/core';
import { ConfirmationService as ConfirmationServicePrimeng } from 'primeng/api'

@Injectable({
  providedIn: 'root'
})
export class ServiceConfirmation {
  constructor(private confirmationService: ConfirmationServicePrimeng) {}

	confirm(confirmation: {
		message: string;
		accept: () => void;
		header?: string;
		rejectLabel?: string;
		acceptLabel?: string;
		reject?: () => void;
		event?: Event;
	}): void {
		this.confirmationService.confirm({
			header: confirmation.header || 'Deseja confirmar a ação?',
			message: confirmation.message,
			accept: confirmation.accept,
			reject: confirmation.reject,
			closable: false,
			closeOnEscape: false,
			rejectLabel: confirmation.rejectLabel || 'Cancelar',
			acceptLabel: confirmation.acceptLabel || 'Confirmar',
			target: confirmation.event?.target || undefined,
		});
	}
}
