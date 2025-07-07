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
exports.ServiceController = void 0;
const ResponseUtils_1 = require("../libs/ResponseUtils");
const CustomErrors_1 = require("../libs/CustomErrors");
class ServiceController {
    constructor(serviceService) {
        this.serviceService = serviceService;
        this.getService = this.getService.bind(this);
    }
    getService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const services = yield this.serviceService.getService();
                //ResponseUtils.success(res, services, 'Services retrieved successfully');
                res.status(200).json({ results: services });
            }
            catch (error) {
                if (error instanceof CustomErrors_1.CustomErrors) {
                    ResponseUtils_1.ResponseUtils.error(res, error.message, error.statusCode);
                    return;
                }
                next(error);
            }
        });
    }
}
exports.ServiceController = ServiceController;
