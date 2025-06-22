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
exports.CustomerController = void 0;
class CustomerController {
    constructor(customerService) {
        this.customerService = customerService;
        // Bind the original method to maintain API compatibility
        this.getAllCustomerType = this.getAllCustomerType.bind(this);
    }
    // Keep the original method name and response format to maintain API compatibility
    getAllCustomerType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { is_show } = req.query;
                const allCustomerTypes = yield this.customerService.getAllCustomerType(is_show !== undefined ? Number(is_show) : undefined);
                // Maintain the original response format: direct array response
                res.status(200).json(allCustomerTypes);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.CustomerController = CustomerController;
