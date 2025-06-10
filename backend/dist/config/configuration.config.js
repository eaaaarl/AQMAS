"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configController = void 0;
const config_controller_1 = require("./config.controller");
const config_repository_1 = require("./config.repository");
const config_service_1 = require("./core/service/config.service");
const configRepository = new config_repository_1.ConfigRepository();
const configService = new config_service_1.ConfigService(configRepository);
exports.configController = new config_controller_1.ConfigController(configService);
