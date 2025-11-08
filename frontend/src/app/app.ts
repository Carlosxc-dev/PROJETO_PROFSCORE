import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogComponent } from './shared/components-primeNG/confirm-dialog/confirm-dialog';
import { Toast } from './shared/components-primeNG/toast/toast';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,ConfirmDialogComponent, Toast
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('POTAMOS');
}
