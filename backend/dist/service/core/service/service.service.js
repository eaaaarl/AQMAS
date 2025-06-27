"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
const CustomErrors_1 = require("../../../libs/CustomErrors");
const logger_1 = require("../../../infrastructure/logger/logger");
class ServiceService {
    constructor(serviceRepository) {
        this.serviceRepository = serviceRepository;
    }
    getService() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const services = yield this.serviceRepository.getService();
                if (!services.length) {
                    throw new CustomErrors_1.CustomErrors('No services found', 404);
                }
                return services;
            }
            catch (error) {
                if (error instanceof CustomErrors_1.CustomErrors) {
                    throw error;
                }
                logger_1.logger.error('Error in ServiceService.getService:', { error });
                throw new CustomErrors_1.CustomErrors('Failed to process service request', 500);
            }
        });
    }
}
exports.ServiceService = ServiceService;
