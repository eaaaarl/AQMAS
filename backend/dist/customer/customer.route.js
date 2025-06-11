"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoute = void 0;
const express_1 = __importDefault(require("express"));
const customer_config_1 = require("./customer.config");
const router = express_1.default.Router();
router.get('/allType', customer_config_1.customerController.getAllCustomerType);
exports.customerRoute = router;
