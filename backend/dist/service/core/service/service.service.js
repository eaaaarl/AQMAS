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
class ServiceService {
    constructor(serviceRepository) {
        this.serviceRepository = serviceRepository;
    }
    getService() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service = yield this.serviceRepository.getService();
                return service;
            }
            catch (error) {
                console.error('Error fetching queer service:', error);
                throw error;
            }
        });
    }
}
exports.ServiceService = ServiceService;
