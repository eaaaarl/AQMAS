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
exports.QueueService = void 0;
const queu_schema_1 = require("../schema/queu.schema");
const CustomErrors_1 = require("../../../libs/CustomErrors");
const zod_1 = require("zod");
class QueueService {
    constructor(queueRepository) {
        this.queueRepository = queueRepository;
        this.CACHE_TTL = 60 * 1000; // 1 minute
        this.countCache = new Map();
    }
    validateInput(data, schema) {
        try {
            return schema.parse(data);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                throw new CustomErrors_1.ValidationError('Invalid input data', error.errors);
            }
            throw error;
        }
    }
    getCachedValue(key) {
        const cached = this.countCache.get(key);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
            return cached.value;
        }
        return null;
    }
    setCachedValue(key, value) {
        this.countCache.set(key, { value, timestamp: Date.now() });
    }
    createQueue(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const queuePayload = this.validateInput(data, queu_schema_1.queueSchema);
            const newQueue = yield this.queueRepository.createQueue(queuePayload);
            // Invalidate relevant caches
            this.countCache.clear();
            return newQueue;
        });
    }
    createQueueDetail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(data) || data.length === 0) {
                throw new CustomErrors_1.QueueError('Queue details array cannot be empty');
            }
            const validatedPayload = data.map(item => this.validateInput(item, queu_schema_1.queueDetailsSchema));
            const newQueueDetail = yield this.queueRepository.createQueueDetails(validatedPayload);
            // Invalidate relevant caches
            this.countCache.clear();
            return newQueueDetail;
        });
    }
    createQueueWithDetail(queueData, queueDetailsData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(queueDetailsData) || queueDetailsData.length === 0) {
                throw new CustomErrors_1.QueueError('Queue details array cannot be empty');
            }
            const queuePayload = this.validateInput(queueData, queu_schema_1.queueSchema);
            const detailsPayload = queueDetailsData.map(item => this.validateInput(item, queu_schema_1.queueDetailsSchema));
            const trx = yield this.queueRepository.beginTransaction();
            try {
                const queue = yield this.queueRepository.createQueue(queuePayload, trx);
                const details = yield this.queueRepository.createQueueDetails(detailsPayload, trx);
                yield trx.commit();
                // Invalidate relevant caches
                this.countCache.clear();
                return { queue, details };
            }
            catch (error) {
                yield trx.rollback();
                throw error;
            }
        });
    }
    countQueue(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const queueCountQueryPayload = this.validateInput(data, queu_schema_1.queueCountQuerySchema);
            const cacheKey = `count:${queueCountQueryPayload.Date}:${queueCountQueryPayload.type_id}`;
            const cachedValue = this.getCachedValue(cacheKey);
            if (cachedValue !== null) {
                return cachedValue;
            }
            const count = yield this.queueRepository.countQueue(queueCountQueryPayload);
            this.setCachedValue(cacheKey, count);
            return count;
        });
    }
    countQueueAllService() {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = 'count:all-services';
            const cachedValue = this.getCachedValue(cacheKey);
            if (cachedValue !== null) {
                return cachedValue;
            }
            const count = yield this.queueRepository.countQueueAllService();
            this.setCachedValue(cacheKey, count);
            return count;
        });
    }
    countByServiceCount(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = this.validateInput(data, queu_schema_1.queueByServiceCountSchema);
            const cacheKey = `count:service:${payload.service_id}`;
            const cachedValue = this.getCachedValue(cacheKey);
            if (cachedValue !== null) {
                return { count: cachedValue, service_name: 'Unknown Service' };
            }
            const result = yield this.queueRepository.countByServiceCount(payload);
            this.setCachedValue(cacheKey, result);
            return result;
        });
    }
}
exports.QueueService = QueueService;
