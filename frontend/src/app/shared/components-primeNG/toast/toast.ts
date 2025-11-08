import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-toast',
  imports: [
    CommonModule,
    ToastModule
  ],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class Toast {

}
