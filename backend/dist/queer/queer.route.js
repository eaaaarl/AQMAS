"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const queer_config_1 = require("./queer.config");
const router = express_1.default.Router();
router.get("/service", queer_config_1.queerController.getQueerService);
exports.queerRoutes = router;
