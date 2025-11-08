import { Component, Input, OnInit } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { Tag } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Data, Router } from '@angular/router';
import { Image } from 'primeng/image';
import { SelectItem } from 'primeng/api';
import { SelectModule } from 'primeng/select';

export enum Status {
	COMPLETED = 'Bom',
	PROCESSING = 'Normal',
	FAILED = 'Ruim',
}

export interface IDataView {
	id: string;
	user?: string;
	name: string;
	fazenda: string;
	status: Status;
	image: string;
	total_images: string;
	createdAt: Date;
}

@Component({
	selector: 'app-data-view',
	imports: [
		DataView,
		Tag,
		ButtonModule,
		CommonModule,
		SelectButton,
		FormsModule,
		Image,
		SelectModule,
	],
	templateUrl: './data-view.html',
	styleUrl: './data-view.css',
})
export class DataViewComponent implements OnInit {
	constructor(private router: Router) {}

	@Input() data: IDataView[] = [];
	imageUrl = 'assets/educacao.png';
	sortOrder!: number;
	sortOptions!: SelectItem[];
	sortField!: string;
	sortKey!: string;

	layout: 'list' | 'grid' = 'list';
	options = ['list', 'grid'];

	ngOnInit() {
		this.sortOptions = [
			{ label: 'Crescente', value: '!price' },
			{ label: 'Decrescente', value: 'price' },
		];
	}

	getSeverity(data: any) {
		switch (data.status) {
			case 'Bom':
				return 'success';

			case 'Normal':
				return 'info';

			case 'Ruim':
				return 'danger';

			default:
				return null;
		}
	}

	onSortChange(event: any) {
		let value = event.value;

		if (value.indexOf('!') === 0) {
			this.sortOrder = -1;
			this.sortField = value.substring(1, value.length);
		} else {
			this.sortOrder = 1;
			this.sortField = value;
		}
	}
}
