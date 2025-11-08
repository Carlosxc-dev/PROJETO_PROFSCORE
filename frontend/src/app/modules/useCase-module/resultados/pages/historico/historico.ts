import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Upload } from '../../../../../shared/components-app/upload/upload';
import { ButtonComponent } from '../../../../../shared/components-primeNG/button/button';
import {
	DataViewComponent,
	IDataView,
	Status,
} from '../../../../../shared/components-primeNG/data-view/data-view';
import { DialogComponent } from '../../../../../shared/components-primeNG/dialog/dialog';
import { UploadService } from '../../services/upload-service';
import { ServiceNotification } from '../../../../../shared/services/notification/service-notification';
import { Websocket } from '../../../../../core/websocket/websocket';
import {
	FormConfig,
	FormData,
	InputGroup,
} from '../../../../../shared/components-primeNG/input-group/input-group';

export interface IInfosDisplay {
	status: string;
	fazenda: string;
	total_images: number;
	data: string;
}

export interface ImageRequestsResponse {
	farmName: string;
	userName: string;
	requests: RequestItem[];
}

export interface RequestItem {
	folder: string;
	feedlots: FeedlotItem[];
}

export interface FeedlotItem {
	name: string;
	urls: string[];
}

export interface IHistorico {
	requests: IHistoricoItem[];
}

export interface IHistoricoItem {
	idFolder: string;
	farmName: string;
	userId: string;
	totalImagesRequest: string;
	createdAt: Date;
	statusRequest: Status;
}

@Component({
	selector: 'app-historico',
	imports: [
		ButtonModule,
		Upload,
		PanelModule,
		CommonModule,
		ButtonComponent,
		DialogComponent,
		DataViewComponent,
		InputGroup,
	],
	templateUrl: './historico.html',
	styleUrl: './historico.css',
})
export class DisplayResults implements OnInit {
	constructor(
		private uploadService: UploadService,
		private serviceNotification: ServiceNotification,
		private wsService: Websocket,
		private cdr: ChangeDetectorRef
	) {}

	dataViewHistorico: IDataView[] = [];
	responseData: any;
	displayDialog: boolean = false;
	messages: any[] = [];
	headerDialogCreateUser: string = '';
	isEditMode = false;
	isCreateMode = false;

	customerFormConfigCreate: FormConfig = {
		showTypeUser: true,
		placeholderTypeUser: 'Tipo de Deficiência/Doença',
		haveUpload: true,
		placeholderSubmitButton: 'Enviar',
	};

	customerDataCreate: FormData = {
		name: '',
		email: '',
		password: '',
		selectedType: undefined,
		selectedAccess: undefined,
		selectMenu: undefined,
	};

	customerTypes = [
		{ name: 'Ferrugem', value: 'Ferrugem' },
		{ name: 'Bicho Mineiro', value: 'Bicho Mineiro' },
		{ name: 'Phoma', value: 'Phoma' },
	];

	onSubmit(data: any) {
		this.uploadService.createBucket(data).subscribe(() => {
			this.customerDataCreate = {
				selectedType: undefined,
			};
			this.isCreateMode = false;
		});
	}

	ngOnInit(): void {
		const mockedResponse: IHistorico = {
			requests: [
				{
					idFolder: 'folder123',
					farmName: 'Fazenda handsOn',
					userId: 'usuario123',
					totalImagesRequest: Status.COMPLETED,
					createdAt: new Date('2024-06-10T14:30:00Z'),
					statusRequest: Status.COMPLETED,
				},
				{
					idFolder: 'folder123',
					farmName: 'Fazenda handsOn',
					userId: 'usuario123',
					totalImagesRequest: Status.COMPLETED,
					createdAt: new Date('2024-06-10T14:30:00Z'),
					statusRequest: Status.PROCESSING,
				},
				{
					idFolder: 'folder123',
					farmName: 'Fazenda handsOn',
					userId: 'usuario123',
					totalImagesRequest: Status.COMPLETED,
					createdAt: new Date('2024-06-10T14:30:00Z'),
					statusRequest: Status.FAILED,
				},
			],
		};
		this.mountDataViewHistorico(mockedResponse);
	}

	private mountDataViewHistorico(response: IHistorico) {
		// Cria um NOVO array para garantir detecção de mudanças
		this.dataViewHistorico = [
			...response.requests.map((item: IHistoricoItem) => ({
				id: item.idFolder,
				name: item.idFolder,
				fazenda: item.farmName,
				status: item.statusRequest,
				image: 'bamboo-watch.jpg',
				user: item.userId,
				total_images: item.totalImagesRequest,
				createdAt: new Date(item.createdAt),
			})),
		];
	}

	// showDialog() {
	// 	this.displayDialog = true;
	// }

	showDialog() {
		this.headerDialogCreateUser = 'Cadastrar Nova Fazenda';
		this.isEditMode = false;
		this.isCreateMode = true;
	}

	onUploadCompleted(data: any) {
		console.log('Upload completed with data:', data);
	}
}
