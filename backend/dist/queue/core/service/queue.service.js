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
            const payload = queu_schema_1.queueSchema.parse(data);
            const newQueue = yield this.queueRepository.createQueue(payload);
            return newQueue;
        });
    }
    countQueueForTodayAlt() {
        return __awaiter(this, void 0, void 0, function* () {
            const getQueueForToday = this.queueRepository.countQueueForTodayAlt();
            return getQueueForToday;
        });
    }
}
exports.QueueService = QueueService;
