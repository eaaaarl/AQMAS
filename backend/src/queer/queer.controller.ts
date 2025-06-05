import { NextFunction, Request, Response } from "express";
import { QueerService } from "./core/service/queer.service";

export class QueerController {
  constructor(private readonly queerService: QueerService) {
    this.getQueerService = this.getQueerService.bind(this);
  }

  async getQueerService(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await this.queerService.getQueerService();
      res.status(200).json(service);
    } catch (error) {
      console.error("Error in QueerController.getQueerService:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
