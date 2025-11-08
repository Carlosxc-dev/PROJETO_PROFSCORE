import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SectionComponent } from '../../../../shared/components-app/section-component/section-component';
import { MenuTemplate } from '../../../../shared/components-primeNG/menu-template/menu-template';
import { Websocket } from '../../../../core/websocket/websocket';

@Component({
	selector: 'app-main',
	imports: [SectionComponent, CommonModule, RouterOutlet, MenuTemplate],
	templateUrl: './main.html',
	styleUrl: './main.css',
})
export class Main implements OnInit {
	constructor() {}

	videoUrl: string = '';
	urls_images_detect: string[] = [];
	urls_images_segment: string[] = [];
	nameBaiaHome: string = '';

	isMobileView: boolean = false;

	ngOnInit() {
		this.checkScreenSize();
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		this.checkScreenSize();
	}

	checkScreenSize() {
		// 768px é o breakpoint padrão para tablet
		this.isMobileView = window.innerWidth <= 768;
	}
}
