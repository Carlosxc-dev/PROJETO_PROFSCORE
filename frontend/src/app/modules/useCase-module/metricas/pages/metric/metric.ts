import { ChartModule } from 'primeng/chart';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Panel } from 'primeng/panel';
import { ButtonComponent } from '../../../../../shared/components-primeNG/button/button';
import { UserService } from '../../../../user-module/services/UserService';

interface IInfos {
	fazenda?: string;
	total_images_enviadas?: number;
	total_images_recebidas?: number;
	total_atipicos?: number;
}

interface ChartData {
	labels: string[];
	datasets: { label: string; data: number[]; backgroundColor: string[] }[];
}

interface ChartConfig {
	type: 'bar' | 'line' | 'pie' | 'doughnut' | 'polarArea' | 'radar';
	data: ChartData;
	options: any;
}

@Component({
	selector: 'app-metric',
	imports: [ChartModule, CommonModule, Panel, ButtonComponent],
	templateUrl: './metric.html',
	styleUrl: './metric.css',
})
export class Metric implements OnInit {
	constructor(private userService: UserService) {}
	chartData: any;
	chartOptions: any;
	showLegend: boolean = true;
	isDarkTheme: boolean = this.getTheme();

	infos: IInfos = {
		fazenda: '',
		total_images_enviadas: 0,
		total_atipicos: 0,
	};

	chartConfigBar: ChartConfig = {
		type: 'bar',
		data: {
			labels: [],
			datasets: [],
		},
		options: this.ChartOptions(),
	};

	ngOnInit() {
		this.getReport();
	}

	toggleTheme() {
		this.isDarkTheme = !this.isDarkTheme;
		this.chartConfigBar.options = this.ChartOptions();
		this.chart?.refresh();
	}

	getTheme() {
		return document.documentElement.classList.contains('toggleTheme');
	}

	@ViewChild('chart') chart: any;

	ngAfterViewInit() {
		setTimeout(() => {
			this.chartConfigBar.options = this.ChartOptions(); // recria com tema aplicado
			this.chart?.refresh(); // força redraw
		});
	}

	getReport() {
		const response = {
			totalEnviado: 60,
			totalAtipicosPorBaia: [
				{ nome: 'Phoma', quant: 10 },
				{ nome: 'Ferrugem', quant: 20 },
				{ nome: 'Bicho-mineiro', quant: 30 },
			],
		};

		this.infos.total_images_enviadas = response.totalEnviado;
		this.infos.fazenda = 'Fazenda handon';

		this.chartConfigBar.data = this.createChartData(
			response.totalAtipicosPorBaia
		);
	}

	generatePDF() {
		this.downloadChart();
	}

	createChartData(data: { nome: string; quant: number }[]): ChartData {
		// Proteção contra undefined/null
		if (!data || !Array.isArray(data) || data.length === 0) {
			return {
				labels: [],
				datasets: [
					{
						label: 'Sem dados',
						data: [],
						backgroundColor: [],
					},
				],
			};
		}

		const datasetX = data.map((item) => {
			return {
				label: item.nome,
				data: [item.quant],
				backgroundColor: this.getRandomColors(1),
			};
		});

		return {
			labels: data.map((item) => item.nome),
			datasets: datasetX,
		};
	}

	ChartOptions() {
		return {
			responsive: true,
			maintainAspectRatio: false,
			indexAxis: 'x', // 👈 deixa o gráfico horizontal
			plugins: {
				title: {
					display: true,
					text: 'Quantidade de imagens por Classe', // 👈 título aqui
					color: this.isDarkTheme ? '#fff' : '#000',
					font: {
						size: 16,
						weight: 'bold',
					},
					padding: {
						top: 10,
						bottom: 20,
					},
				},
				legend: {
					display: this.showLegend,
					position: 'top',
					labels: {
						color: this.isDarkTheme ? '#fff' : '#000',
					},
				},
				tooltip: {
					enabled: true,
				},
			},
			scales: {
				x: {
					ticks: {
						color: this.isDarkTheme ? '#fff' : '#000',
					},
					grid: {
						color: this.isDarkTheme
							? 'rgba(255,255,255,0.1)'
							: 'rgba(0,0,0,0.1)',
					},
				},
				y: {
					beginAtZero: true,
					ticks: {
						color: this.isDarkTheme ? '#fff' : '#000',
					},
					grid: {
						color: this.isDarkTheme
							? 'rgba(255,255,255,0.1)'
							: 'rgba(0,0,0,0.1)',
					},
				},
			},
			backgroundColor: this.isDarkTheme ? '#444' : '#fff',
		};
	}

	downloadChart() {
		const originalTheme = this.isDarkTheme;

		this.isDarkTheme = false;
		let downloadDone = false; // flag

		this.chartConfigBar.options = {
			...this.ChartOptions(),
			animation: {
				onComplete: () => {
					if (downloadDone) return; // evita múltiplos downloads
					downloadDone = true;

					const chartElement = document.querySelector(
						'canvas'
					) as HTMLCanvasElement;
					const ctx = chartElement.getContext('2d')!;

					// salva conteúdo original
					const temp = ctx.getImageData(
						0,
						0,
						chartElement.width,
						chartElement.height
					);

					// aplica fundo branco
					ctx.globalCompositeOperation = 'destination-over';
					ctx.fillStyle = '#ffffff';
					ctx.fillRect(0, 0, chartElement.width, chartElement.height);

					// exporta
					const link = document.createElement('a');
					link.href = chartElement.toDataURL('image/png');
					link.download = 'chart.png';
					link.click();

					// restaura
					ctx.clearRect(
						0,
						0,
						chartElement.width,
						chartElement.height
					);
					ctx.putImageData(temp, 0, 0);
					ctx.globalCompositeOperation = 'source-over';

					// volta ao tema original
					this.isDarkTheme = originalTheme;
					this.chartConfigBar.options = this.ChartOptions();
					this.chart?.refresh(); // pode ser necessário, mas não disparará outro download
				},
			},
		};

		this.chart?.refresh(); // força redesenho
	}

	getRandomColors(num: number): string[] {
		const colors = [];
		for (let i = 0; i < num; i++) {
			colors.push(
				`#${Math.floor(Math.random() * 16777215)
					.toString(16)
					.padStart(6, '0')}`
			);
		}
		return colors;
	}
}
