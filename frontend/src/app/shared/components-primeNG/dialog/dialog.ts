import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'lib-dialog',
    imports: [CommonModule, DialogModule, ButtonModule, Dialog],
    templateUrl: './dialog.html',
    styleUrl: './dialog.css',
})
export class DialogComponent {
    @Input() header: string = '';
    @Input() visible: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    @Input() modal: boolean = true;
    @Input() breakpoints: any = { '1199px': '75vw', '575px': '90vw' };
    @Input() style: any = { width: '50vw', minWidth: '300px', display: 'flex' };
    @Input() draggable: boolean = false;
    @Input() resizable: boolean = false;

    @Output() onHide = new EventEmitter<void>();

    handleHide() {
        this.visible = false;
        this.visibleChange.emit(this.visible); // sincroniza com o pai
        this.onHide.emit(); // evento extra se você quiser
    }

    showDialog() {
        this.visible = true;
        this.visibleChange.emit(this.visible); // também sincroniza
    }
}
