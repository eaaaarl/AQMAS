import { ServiceService } from "./core/service/service.service";
import { ServiceController } from "./service.controller";
import { ServiceRepository } from "./service.repository";

const serviceRepository = new ServiceRepository();
const serviceService = new ServiceService(serviceRepository);
export const serviceController = new ServiceController(serviceService);
