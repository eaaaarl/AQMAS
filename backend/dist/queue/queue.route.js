"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const queue_config_1 = require("./queue.config");
const queue_controller_1 = require("./queue.controller");
const router = express_1.default.Router();
// Queue creation routes
router.post('/', queue_controller_1.queueValidation.createQueue, queue_config_1.queueController.createQueue);
router.post('/detail', queue_controller_1.queueValidation.createQueueDetail, queue_config_1.queueController.createQueueDetail);
router.post('/with-detail', queue_controller_1.queueValidation.createQueueWithDetail, queue_config_1.queueController.createQueueWithDetail);
// Queue counting routes
router.get('/allservicecount', queue_config_1.queueController.countQueueAllService);
router.get('/byservicecount/:service_id', queue_controller_1.queueValidation.countByServiceCount, queue_config_1.queueController.countByServiceCount);
router.get('/count', queue_config_1.queueController.countQueue);
exports.default = router;
