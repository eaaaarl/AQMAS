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
class ServiceController {
    constructor(serviceService) {
        this.serviceService = serviceService;
        this.getService = this.getService.bind(this);
    }
    getService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service = yield this.serviceService.getService();
                res.status(200).json(service);
            }
            catch (error) {
                console.error('Error in ServiceController GetService:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.ServiceController = ServiceController;
