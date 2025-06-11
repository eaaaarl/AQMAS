"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueRoute = void 0;
const express_1 = __importDefault(require("express"));
const queue_config_1 = require("./queue.config");
const router = express_1.default.Router();
router.post('/', queue_config_1.queueController.createQueue);
router.get('/count', queue_config_1.queueController.countQueue);
exports.queueRoute = router;
