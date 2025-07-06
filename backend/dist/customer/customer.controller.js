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
const CustomErrors_1 = require("../libs/CustomErrors");
class CustomerController {
    constructor(customerService) {
        this.customerService = customerService;
        this.getAllCustomerType = this.getAllCustomerType.bind(this);
    }
    getAllCustomerType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { is_show } = req.query;
                if (is_show !== undefined && !['0', '1'].includes(is_show)) {
                    throw new CustomErrors_1.ValidationError('is_show parameter must be 0 or 1');
                }
                const allCustomerTypes = yield this.customerService.getAllCustomerType(is_show !== undefined ? Number(is_show) : undefined);
                // ResponseUtils.success(res, allCustomerTypes, 'Customer types retrieved successfully');
                res.status(200).json(allCustomerTypes);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.CustomerController = CustomerController;
