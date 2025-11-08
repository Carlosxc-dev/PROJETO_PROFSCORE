import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-component.html',
  styleUrl: './section-component.css',
})
export class SectionComponent {
  @Input() heightSecao: string = '80vh';
}
