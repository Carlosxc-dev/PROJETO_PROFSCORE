import {
	AfterViewInit,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Table, TableFilterEvent, TableModule } from 'primeng/table';
import { Skeleton } from 'primeng/skeleton';
import { FilterMetadata } from 'primeng/api';
import { Action, ActionButtonComponent } from './action-button/action-button';
import { ButtonComponent } from '../button/button';
import { InputComponent } from '../input/input';
import { DialogComponent } from '../dialog/dialog';


@Component({
	selector: 'lib-table',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TableModule,
		Skeleton,
		ButtonComponent,
		InputComponent,
		ActionButtonComponent,
		DialogComponent,
	],
	templateUrl: './table.html',
	styleUrl: './table.css',
})
export class TableComponent implements AfterViewInit, OnInit {
	@Input() data: Row[] = [];
	@Input() columns: Column[] = [];
	@Input() loading = false;
	@Input() showLoader = false;
	@Input() totalRecords = 0;
	@Input() rows = 10;
	@Input() rowsPerPageOptions: number[] = [10, 25, 50, 100, 200];
	@Input() paginator = true;
	@Input() stateKey = 'tableState';
	@Input() globalFilterFields: string[] = [];
	@Input() dataKey = 'id';
	@Input() currencyCode: 'BRL' | 'USD' | 'EUR' = 'BRL';
	@Input() showMoreButton = false;
	@Input() headerDialogCreateUser: string = '';

	@Input() displayDialog: boolean = false;

	@Output() rowSelect: EventEmitter<Row> = new EventEmitter();
	@Output() rowUnselect: EventEmitter<Row> = new EventEmitter();
	@Output() refresh: EventEmitter<void> = new EventEmitter();

	@ViewChild(Table) table: Table | undefined;

	selectedData: Row[] = [];
	showClearFilterButton = true;
	searchControl = new FormControl('');
	filteredColumns: Column[] = [];

	columnsWidths: ColumnWidths = {};
	totalColumnsWidth = 0;

	ngOnInit() {
		this.searchControl.valueChanges
			.pipe(debounceTime(300))
			.subscribe((term) => {
				this.onFilterGlobal(term);
			});

		this.filteredColumns = this.columns.filter(
			(column) => column.showToUser && column.visible
		);

		this.calculateColumnsWidths();
	}

	ngAfterViewInit() {
		this.globalFilterFields = this.columns
			.filter((column) => column.showToUser)
			.map((column) => column.field);

		const state = localStorage.getItem(this.stateKey);

		if (state) {
			const parsedState = JSON.parse(state);

			if (parsedState.filters) {
				this.onFilterGlobal(parsedState.filters.global?.value);
			}
		}
	}

	onRowSelected(event: any) {
		this.rowSelect.emit(event);
	}

	showDialog() {
		
		this.displayDialog = true;
	}

	onRowUnselected(event: any) {
		this.rowUnselect.emit(event);
	}

	clearSelection() {
		this.selectedData = [];
	}

	get getSelectedData(): Row[] {
		return this.selectedData;
	}

	get getColumns(): Column[] {
		return this.columns.filter((column) => column.visible);
	}

	get getGlobalFilterFields(): string[] {
		return this.globalFilterFields;
	}

	onFilter(event: TableFilterEvent) {
		if (!event.filters || !this.table) return;

		const filters = event.filters;

		this.showClearFilterButton = Object.keys(filters).some((key) => {
			if (!event.filters || !event.filters[key]) return false;
			if (key === 'global' && event.filters[key].value) return true;

			const column = this.columns.find((column) => column.field === key);
			if (!column) return false;

			return (event.filters[key] as FilterMetadata[]).some((filter) => {
				if (filter.value) return true;

				return false;
			});
		});
	}

	onFilterGlobal(term: string | null) {
		if (!this.table) return;

		if (term && term.length > 0) {
			this.showClearFilterButton = true;
			this.table.filterGlobal(term, 'contains');
		} else {
			this.showClearFilterButton = false;
			this.table.clear();
			this.table.reset();
			this.table.clearFilterValues();
			this.table.clearState();
		}
	}

	onClearFilter() {
		if (!this.table) return;

		this.searchControl.setValue('');
		this.showClearFilterButton = false;
		this.table.clear();
		this.table.reset();
		this.table.clearFilterValues();
		this.table.clearState();
	}

	onExport() {
		if (!this.table) return;

		this.table.exportCSV({
			allValues: true,
		});
	}

	onRefresh() {
		this.refresh.emit();
	}

	calculateColumnsWidths() {
		this.totalColumnsWidth = 0;

		const columnsWidths = this.columns
			.filter((column) => column.showToUser && column.visible)
			.reduce(
				(
					acc: {
						[key: string]: number;
					},
					column: Column
				) => {
					const fraction = column.fraction || 1;

					this.totalColumnsWidth += fraction;

					acc[column.field] = fraction;

					return acc;
				},
				{}
			);

		const size = this.showMoreButton ? 95 : 100;

		this.columnsWidths = Object.keys(columnsWidths).reduce(
			(
				acc: {
					[key: string]: string;
				},
				key: string
			) => {
				const value: number =
					(columnsWidths[key] / this.totalColumnsWidth) * size;

				acc[key] = `${value.toFixed(2)}%`;

				return acc;
			},
			{}
		);
	}
}

export { ActionButtonComponent };

export interface Row {
	[key: string]: string | number | boolean | Date | Action[];
}

export interface Column {
	field: string;
	header: string;
	type:
		| 'text'
		| 'date'
		| 'datetime'
		| 'currency'
		| 'number'
		| 'boolean'
		| 'action';
	sortable?: boolean;
	filterable?: boolean;
	visible?: boolean;
	showToUser?: boolean;
	fraction?: number;
}

export interface ColumnWidths {
	[key: string]: string;
}
