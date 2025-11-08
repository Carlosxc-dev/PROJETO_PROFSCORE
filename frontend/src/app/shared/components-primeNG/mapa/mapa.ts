import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-mapa',
	imports: [],
	templateUrl: './mapa.html',
	styleUrl: './mapa.css',
})
export class Mapa {
	@Input() latitude: number = 0;
	@Input() longitude: number = 0;
	zoom: number = 18; // Zoom alto para ver detalhes da fazenda

	mapUrl!: SafeResourceUrl;

	constructor(private sanitizer: DomSanitizer) {}

	ngOnChanges() {
	// Modo satélite sem API key
	// t=k = tipo satélite (satellite/hybrid)
	// t=h = híbrido (satélite com rótulos)
	// t=m = mapa normal
	const url = `https://maps.google.com/maps?q=${this.latitude},${this.longitude}&t=h&z=${this.zoom}&output=embed`;
	this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
}
}
