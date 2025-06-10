"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueController = void 0;
const queue_service_1 = require("./core/service/queue.service");
const queue_controller_1 = require("./queue.controller");
const queue_repository_1 = require("./queue.repository");
const queueRepository = new queue_repository_1.QueueRepository();
const queueService = new queue_service_1.QueueService(queueRepository);
exports.queueController = new queue_controller_1.QueueController(queueService);
