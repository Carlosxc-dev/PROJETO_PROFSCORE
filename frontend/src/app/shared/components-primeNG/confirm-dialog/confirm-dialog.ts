import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule, ConfirmDialog, ButtonComponent],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css'
})
export class ConfirmDialogComponent {

}
