import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule, UrlTree } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';
import { TooltipOptions } from 'primeng/api';

@Component({
  selector: 'lib-button',
  imports: [CommonModule, RouterModule, ButtonModule, Tooltip],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class ButtonComponent {
  @Input() loading = false;
  @Input() disabled = false;
  @Input() label = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() icon = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() severity:
    | 'info'
    | 'success'
    | 'warn'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | 'help'
    | 'primary' = 'primary';
  @Input() variant: 'text' | 'outlined' | undefined = undefined;
  @Input() rounded = false;
  @Input() raised = false;
  @Input() link = false;
  @Input() size: 'small' | 'large' = 'small';
  @Input() fluid = false;
  @Input() styleClass = '';
  @Input() routerLink: string | [] | UrlTree | null | undefined = '';
  @Input() tooltip = '';
  @Input() tooltipOptions: TooltipOptions = {
    showDelay: 100,
    hideDelay: 100,
    life: 1500,
    tooltipStyleClass: 'description text-xs',
    tooltipEvent: 'hover',
    tooltipPosition: 'top',
  };
}