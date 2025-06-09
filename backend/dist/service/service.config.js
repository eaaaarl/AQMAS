"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceController = void 0;
const service_service_1 = require("./core/service/service.service");
const service_controller_1 = require("./service.controller");
const service_repository_1 = require("./service.repository");
const serviceRepository = new service_repository_1.ServiceRepository();
const serviceService = new service_service_1.ServiceService(serviceRepository);
exports.serviceController = new service_controller_1.ServiceController(serviceService);
