import { CommonModule } from '@angular/common';
import { Component, Input  } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  templateUrl: './loading.components.html',
  styleUrl: './loading.components.css'
})
export class Loading {
  @Input() visible: boolean = false;
  @Input() message: string = 'Processando video...';
}
