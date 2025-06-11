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
exports.QueueRepository = void 0;
const database_1 = require("../infrastructure/database/database");
const CustomErrors_1 = require("../libs/CustomErrors");
class QueueRepository {
    constructor() {
        this.database = database_1.db;
    }
    createQueue(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newQueue = yield this.database('queue').insert(Object.assign(Object.assign({}, payload), { trans_date: new Date(payload.trans_date) }));
                return newQueue;
            }
            catch (error) {
                console.error('Database error in createQueue:', error);
                throw new CustomErrors_1.DatabaseErrors('Failed to create queue at createQueue method');
            }
        });
    }
    countQueueForTodayAlt() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.database('queue')
                    .count('* as count')
                    .whereRaw('DATE(trans_date) = CURDATE()') // For MySQL
                    // .whereRaw('DATE(trans_date) = DATE(\'now\')') // For SQLite
                    // .whereRaw('trans_date::date = CURRENT_DATE') // For PostgreSQL
                    .first();
                return parseInt(result === null || result === void 0 ? void 0 : result.count) || 0;
            }
            catch (error) {
                console.error('Database error in countQueueForTodayAlt:', error);
                throw new CustomErrors_1.DatabaseErrors('Failed to count queue for today at countQueueForTodayAlt method');
            }
        });
    }
}
exports.QueueRepository = QueueRepository;
