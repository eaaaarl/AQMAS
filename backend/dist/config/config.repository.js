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
exports.ConfigRepository = void 0;
const database_1 = require("../database/database");
const CustomErrors_1 = require("../libs/CustomErrors");
class ConfigRepository {
    constructor() {
        this.database = database_1.db;
    }
    getAllConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const configs = yield this.database("config").select("*");
                return configs;
            }
            catch (error) {
                throw new CustomErrors_1.DatabaseErrors("Failed to get all configs at getAllConfig method");
            }
        });
    }
}
exports.ConfigRepository = ConfigRepository;
