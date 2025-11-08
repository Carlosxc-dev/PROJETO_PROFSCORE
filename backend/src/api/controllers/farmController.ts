// src/application/modules/farm/controllers/farmController.ts
import { Request, Response } from "express";
import { FarmUseCase } from "../../application/modules/farm/useCase/FarmUseCase";
import { ILogger } from "infrastructure/logger/logger";
import {
  createFarmSchema,
  updateFarmSchema,
  deleteFarmSchema,
  getFarmByIdSchema,
} from "../validators/farmValidatorSchema.ts";

export class FarmController {
  constructor(
    private farmUseCase: FarmUseCase,
    private logger: ILogger
  ) {}

  async getAllFarms(req: Request, res: Response): Promise<void> {
    try {
      this.logger.info("[FarmController] getAllFarms chamado");
      const response = await this.farmUseCase.getAllFarms();
      res.status(200).send(response);
    } catch (error: any) {
      this.logger.error("[FarmController] Erro em getAllFarms", error);
      res.status(500).send({ message: error.message || error });
    }
  }

  async createFarm(req: Request, res: Response): Promise<void> {
    try {
      this.logger.info("[FarmController] createFarm chamado", req.body);

      const validatedBody = createFarmSchema.parse(req.body); // validação
      const response = await this.farmUseCase.createFarm(validatedBody);

      res.status(201).send(response);
    } catch (error: any) {
      this.logger.error("[FarmController] Erro em createFarm", error);
      res.status(400).send({ message: error.message || error });
    }
  }

  async updateFarm(req: Request, res: Response): Promise<void> {
    try {
      this.logger.info("[FarmController] updateFarm chamado", req.body);

      const validatedBody = updateFarmSchema.parse(req.body); // validação
      const response = await this.farmUseCase.updateFarm(validatedBody);

      res.status(200).send(response);
    } catch (error: any) {
      this.logger.error("[FarmController] Erro em updateFarm", error);
      res.status(400).send({ message: error.message || error });
    }
  }

  async deleteFarm(req: Request, res: Response): Promise<void> {
    try {
      this.logger.info("[FarmController] deleteFarm chamado", req.params);

      const validatedBody = deleteFarmSchema.parse(req.params); // validação
      const response = await this.farmUseCase.deleteFarm(validatedBody);

      res.status(200).send(response);
    } catch (error: any) {
      this.logger.error("[FarmController] Erro em deleteFarm", error);
      res.status(400).send({ message: error.message || error });
    }
  }

  async getFarmById(req: Request, res: Response): Promise<void> {
    try {
      const idObj = { id: req.params.id};
      this.logger.info("[FarmController] getFarmById chamado", idObj);

      const validatedParams = getFarmByIdSchema.parse(idObj); // validação
      const response = await this.farmUseCase.getFarmById(validatedParams);

      res.status(200).send(response);
    } catch (error: any) {
      this.logger.error("[FarmController] Erro em getFarmById", error);
      res.status(400).send({ message: error.message || error });
    }
  }
}
