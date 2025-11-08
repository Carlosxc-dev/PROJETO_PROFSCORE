export interface IBoiRepository {
	findBoiById(boiId: string): Promise<any>;
	createBoi(boiData: any): Promise<any>;
	updateBoi(boiId: string, boiData: any): Promise<any>;
	deleteBoi(boiId: string): Promise<void>;
}
