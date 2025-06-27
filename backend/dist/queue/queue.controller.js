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
exports.queueValidation = exports.QueueController = void 0;
const ResponseUtils_1 = require("../libs/ResponseUtils");
const validation_middleware_1 = require("../infrastructure/middleware/validation.middleware");
const queu_schema_1 = require("./core/schema/queu.schema");
const zod_1 = require("zod");
class QueueController {
    constructor(queueService) {
        this.queueService = queueService;
        this.createQueue = this.createQueue.bind(this);
        this.createQueueDetail = this.createQueueDetail.bind(this);
        this.createQueueWithDetail = this.createQueueWithDetail.bind(this);
        this.countQueue = this.countQueue.bind(this);
        this.countQueueAllService = this.countQueueAllService.bind(this);
        this.countByServiceCount = this.countByServiceCount.bind(this);
    }
    createQueue(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newQueue = yield this.queueService.createQueue(req.body);
                ResponseUtils_1.ResponseUtils.created(res, newQueue, 'Queue created successfully');
            }
            catch (error) {
                next(error);
            }
        });
    }
    createQueueDetail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newQueueDetail = yield this.queueService.createQueueDetail(req.body);
                ResponseUtils_1.ResponseUtils.created(res, newQueueDetail, 'Queue details created successfully');
            }
            catch (error) {
                next(error);
            }
        });
    }
    createQueueWithDetail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { queue: queueData, details: queueDetailsData } = req.body;
                console.log('BACKEND PAYLOAD', queueData, queueDetailsData);
                const result = yield this.queueService.createQueueWithDetail(queueData, queueDetailsData);
                ResponseUtils_1.ResponseUtils.created(res, result, 'Queue and details created successfully');
            }
            catch (error) {
                next(error);
            }
        });
    }
    countQueue(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield this.queueService.countQueue(req.query);
                ResponseUtils_1.ResponseUtils.success(res, { count }, 'Queue count retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        });
    }
    countQueueAllService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield this.queueService.countQueueAllService();
                ResponseUtils_1.ResponseUtils.success(res, { count }, 'All service queue count retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        });
    }
    countByServiceCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield this.queueService.countByServiceCount(req.params);
                ResponseUtils_1.ResponseUtils.success(res, { count }, 'Service queue count retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.QueueController = QueueController;
exports.queueValidation = {
    createQueue: (0, validation_middleware_1.validateBody)(queu_schema_1.queueSchema),
    createQueueDetail: (0, validation_middleware_1.validateBody)(queu_schema_1.queueDetailsSchema.array()),
    createQueueWithDetail: (0, validation_middleware_1.validateBody)(zod_1.z.object({
        queue: queu_schema_1.queueSchema,
        details: queu_schema_1.queueDetailsSchema.array(),
    })),
    countByServiceCount: (0, validation_middleware_1.validateParams)(queu_schema_1.queueByServiceCountSchema),
};
