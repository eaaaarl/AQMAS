import { NextFunction, Request, Response } from "express";
import { ConfigService } from "./core/service/config.service";

export class ConfigController {
  constructor(private readonly configService: ConfigService) {
    this.getAllConfig = this.getAllConfig.bind(this);
  }

  async getAllConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const configs = await this.configService.getAllConfig();
      res.status(200).json(configs);
    } catch (error) {
      next(error);
    }
  }
}
