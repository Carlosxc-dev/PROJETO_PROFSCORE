import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { Image } from 'primeng/image';
import { Mapa } from '../mapa/mapa';

export interface ITab {
	title: string;
	value: number;
}

export interface IData {
	nomeBaia: ITab;
	atipicosBaia: string[];
	coordenadaBaia: {
		latitude: number;
		longitude: number;
	};
} 

@Component({
	selector: 'app-tab-menu',
	imports: [
		TabsModule,
		RouterModule,
		CommonModule,
		TabsModule,
		Image,
		Mapa,
	],
	templateUrl: './tab-menu.html',
	styleUrl: './tab-menu.css',
})
export class TabMenu {
	@Input() data: IData[] = [];

	selectedTab: number = 0
}
