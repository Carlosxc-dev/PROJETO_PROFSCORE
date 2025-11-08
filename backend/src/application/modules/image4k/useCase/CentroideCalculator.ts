// CentroideCalculatorService.ts

import { Coordinate } from "core/valueObjects/coordinate";

// Interface para o serviço
export interface ICentroideCalculatorService {
	calculateCenterExactFeedLot(points: Coordinate[]): Coordinate;
}

// Classe que implementa a interface
export class CentroideCalculatorService implements ICentroideCalculatorService {
	constructor() {}

	/**
	 * Calcula o convex hull (polígono mínimo) de um conjunto de pontos
	 */
	private convexHull(points: Coordinate[]): Coordinate[] {
		const sorted = [...points].sort(
			(a, b) => a.longitude - b.longitude || a.latitude - b.latitude
		);

		const cross = (o: Coordinate, a: Coordinate, b: Coordinate) =>
			(a.longitude - o.longitude) * (b.latitude - o.latitude) -
			(a.latitude - o.latitude) * (b.longitude - o.longitude);

		const lower: Coordinate[] = [];
		for (const p of sorted) {
			while (
				lower.length >= 2 &&
				cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0
			)
				lower.pop();
			lower.push(p);
		}

		const upper: Coordinate[] = [];
		for (let i = sorted.length - 1; i >= 0; i--) {
			const p = sorted[i];
			while (
				upper.length >= 2 &&
				cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0
			)
				upper.pop();
			upper.push(p);
		}

		upper.pop();
		lower.pop();
		return lower.concat(upper);
	}

	/**
	 * Calcula o centroide exato de um polígono definido por pontos
	 */
	private polygonCentroid(poly: Coordinate[]): Coordinate {
		let area = 0;
		let x = 0;
		let y = 0;

		for (let i = 0; i < poly.length; i++) {
			const j = (i + 1) % poly.length;
			const cross =
				poly[i].longitude * poly[j].latitude - poly[j].longitude * poly[i].latitude;
			area += cross;
			x += (poly[i].longitude + poly[j].longitude) * cross;
			y += (poly[i].latitude + poly[j].latitude) * cross;
		}

		area /= 2;
		x /= 6 * area;
		y /= 6 * area;

		return { latitude: y, longitude: x };
	}

	/**
	 * Calcula o centro exato a partir de um array de coordenadas
	 */
	public calculateCenterExactFeedLot(points: Coordinate[]): Coordinate {
		if (!points || points.length === 0) {
			throw new Error("Nenhum ponto fornecido para cálculo do centro exato.");
		}

		const polygon = this.convexHull(points);
		return this.polygonCentroid(polygon);
	}
}

