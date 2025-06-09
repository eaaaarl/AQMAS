"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const service_config_1 = require("./service.config");
const router = express_1.default.Router();
router.get("/service", service_config_1.serviceController.getService);
exports.serviceRoutes = router;
