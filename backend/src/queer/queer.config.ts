import { QueerService } from "./core/service/queer.service";
import { QueerController } from "./queer.controller";
import { QueerRepository } from "./queer.repository";

const queerRepository = new QueerRepository();
const queerService = new QueerService(queerRepository);
export const queerController = new QueerController(queerService);
