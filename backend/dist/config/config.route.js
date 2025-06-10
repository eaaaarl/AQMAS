"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configRoute = void 0;
const express_1 = __importDefault(require("express"));
const configuration_config_1 = require("./configuration.config");
const router = express_1.default.Router();
router.get('/configs', configuration_config_1.configController.getAllConfig);
exports.configRoute = router;
