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
class QueueService {
    constructor(queueRepository) {
        this.queueRepository = queueRepository;
    }
    createQueue(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const queuePayload = queu_schema_1.queueSchema.parse(data);
            const newQueue = yield this.queueRepository.createQueue(queuePayload);
            return newQueue;
        });
    }
    createQueueDetail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const validatedPayload = data.map(item => queu_schema_1.queueDetailsSchema.parse(item));
            return yield this.queueRepository.createQueueDetails(validatedPayload);
        });
    }
    createQueueWithDetail(queueData, queueDetailsData) {
        return __awaiter(this, void 0, void 0, function* () {
            const trx = yield this.queueRepository.beginTransaction();
            try {
                const queuePayload = queu_schema_1.queueSchema.parse(queueData);
                const detailsPayload = queueDetailsData.map(item => queu_schema_1.queueDetailsSchema.parse(item));
                const queue = yield this.queueRepository.createQueue(queuePayload, trx);
                const details = yield this.queueRepository.createQueueDetails(detailsPayload, trx);
                yield trx.commit();
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
            const queueCountQueryPayload = queu_schema_1.queueCountQuerySchema.parse(data);
            const getQueueForToday = yield this.queueRepository.countQueue(queueCountQueryPayload);
            return getQueueForToday;
        });
    }
    countQueueAllService() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.queueRepository.countQueueAllService();
        });
    }
    countByServiceCount(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const queueByServiceCountPayload = queu_schema_1.queueByServiceCountSchema.parse(data);
            return yield this.queueRepository.countByServiceCount(queueByServiceCountPayload);
        });
    }
}
exports.QueueService = QueueService;
