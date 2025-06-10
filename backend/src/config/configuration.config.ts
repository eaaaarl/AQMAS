import { ConfigController } from "./config.controller";
import { ConfigRepository } from "./config.repository";
import { ConfigService } from "./core/service/config.service";

const configRepository = new ConfigRepository();
const configService = new ConfigService(configRepository);

export const configController = new ConfigController(configService);
