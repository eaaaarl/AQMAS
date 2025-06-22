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
exports.CustomerRepository = void 0;
const database_1 = require("../infrastructure/database/database");
const CustomErrors_1 = require("../libs/CustomErrors");
class CustomerRepository {
    constructor() {
        this.tableName = 'customer_type';
        this.database = database_1.db;
    }
    getAllCustomerType(is_show) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.database(this.tableName).select('*').where('is_show', is_show);
            }
            catch (error) {
                console.error('Error at getAllCustomerType', error);
                throw new CustomErrors_1.DatabaseErrors('Failed to fetch customer at getAllCustomerType method');
            }
        });
    }
    getAllCustomerTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.database(this.tableName).select('*');
            }
            catch (error) {
                console.error('Error at getAllCustomerTypes', error);
                throw new CustomErrors_1.DatabaseErrors('Failed to fetch customer at getAllCustomerTypes method');
            }
        });
    }
}
exports.CustomerRepository = CustomerRepository;
