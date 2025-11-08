import { NextFunction, Request, Response } from "express";
import { IUserUseCase } from "application/modules/user/interface/IUserUseCase";
import {
	createUserSchema,
	deleteUserSchema,
	getUserByIdSchema,
	updateUserSchema,
} from "api/validators/userValidators";

import { ILogger } from "infrastructure/logger/logger";
import { IFilesService } from "infrastructure/services/FilesService";
import { IUploadImagesUseCase } from "application/modules/image4k/useCase/UploadImagesUseCase";

export interface IInfosRequest {
	root_folder_id: string;
	root_folder_name?: string;
	folder_name?: string;
	subfolder_index?: number;
	total_subfolders?: number;
	file_name?: string;
	file_type?: string;
}

export class UserController {
	constructor(
		private userUseCase: IUserUseCase,
		private logger: ILogger,
		private filesService: IFilesService,
	) {}

	async getAllUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const response = await this.userUseCase.getAllUser();
			res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const validatedData = getUserByIdSchema.parse(req.params);
			const response = await this.userUseCase.getUserById(validatedData);
			res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const validatedData = createUserSchema.parse(req.body);
			await this.userUseCase.getUserByEmail({ id: validatedData.email });
			const response = await this.userUseCase.createUser(validatedData);
			res.status(201).json(response);
		} catch (error) {
			next(error);
		}
	}

	async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const validatedData = updateUserSchema.parse(req.body);
			const response = await this.userUseCase.updateUser(validatedData);
			res.status(201).json(response);
		} catch (error) {
			next(error);
		}
	}

	async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const validatedData = deleteUserSchema.parse(req.params);
			await this.userUseCase.getUserById(validatedData);
			const response = await this.userUseCase.deleteUser(validatedData);
			res.status(204).json(response);
		} catch (error) {
			next(error);
		}
	}

	// async uploadImages(req: Request, res: Response, next: NextFunction): Promise<any> {
	// 	try {
	// 		const files = req.files as Express.Multer.File[];
	// 		if (!files || files.length === 0) {
	// 			return res.status(400).json({ message: "No files were uploaded." });
	// 		}

	// 		const buffers = files.map((file) => ({
	// 			originalname: file.originalname,
	// 			mimetype: file.mimetype,
	// 			buffer: file.buffer,
	// 		}));

	// 		const userId = req.authUser?.userId;
	// 		const farmId = req.authUser?.farmId;
	// 		if (!userId) return res.status(401).json({ message: "User not authenticated" });
	// 		if (!farmId) return res.status(400).json({ message: "Farm ID not found for the user" });
	// 		// const userId = "9c71b804-5d94-46f0-8df5-5badb24407f2";
	// 		// const farmId = "0a05219b-18ad-4789-9935-0babbe5d857f"
 
	// 		const infosRequest: IInfosRequest  = {
	// 			root_folder_id: req.body.root_folder_id,
	// 			root_folder_name: req.body.root_folder_name,
	// 			folder_name: req.body.folder_name,
	// 			subfolder_index: req.body.subfolder_index,
	// 			total_subfolders: req.body.total_subfolders,
	// 			file_name: req.body.file_name,
	// 			file_type: req.body.file_type,
	// 		}

	// 		// Validação opcional
	// 		if (!infosRequest.root_folder_id) {
	// 			return res.status(400).json({ message: "root_folder_id is required" });
	// 		}

	// 		const response = await this.uploadImagesUseCase.execute(buffers, userId, farmId, infosRequest);
	// 		return res.status(200).json(response);
	// 	} catch (error) {
	// 		next(error);
	// 	}
	// }

}

