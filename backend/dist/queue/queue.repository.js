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
    constructor(database = database_1.db) {
        this.database = database;
    }
    beginTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.database.transaction();
        });
    }
    createQueue(payload, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = trx || this.database;
            try {
                const [transId] = yield db('queue').insert(Object.assign(Object.assign({}, payload), { trans_date: new Date().toISOString() }));
                const newQueue = yield db('queue').where('trans_id', transId).first();
                return newQueue;
            }
            catch (error) {
                console.error('Database error in createQueue:', error);
                throw new CustomErrors_1.DatabaseErrors('Failed to create queue at createQueue method at Repository Layer');
            }
        });
    }
    createQueueDetails(payload, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = trx || this.database;
            try {
                const dataToInsert = payload.map(p => ({
                    trans_id: p.trans_id,
                    trans_date: new Date().toISOString(),
                    service_id: p.service_id,
                }));
                const insertedIds = yield db('queue_detail').insert(dataToInsert);
                const newQueueDetails = yield db('queue_detail').whereIn('trans_id', insertedIds);
                return newQueueDetails;
            }
            catch (error) {
                console.error('Database error in createQueueDetails:', error);
                throw new CustomErrors_1.DatabaseErrors('Failed to create queue detail at createQueueDetails method at Repository Layer');
            }
        });
    }
    countQueue(_a) {
        return __awaiter(this, arguments, void 0, function* ({ Date, type_id }) {
            try {
                const result = yield this.database('queue')
                    .count('* as count')
                    .whereRaw(`${Date}`)
                    .andWhere('type_id', type_id)
                    .first();
                return parseInt(result === null || result === void 0 ? void 0 : result.count) || 0;
            }
            catch (error) {
                console.error('Database error in countQueue:', error);
                throw new CustomErrors_1.DatabaseErrors('Failed to count queue countQueue method at Repository Layer');
            }
        });
    }
    countQueueAllService() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.database('queue')
                    .count('* as count')
                    .where('trans_date', 'DATE(NOW())')
                    .first();
                return Number(result === null || result === void 0 ? void 0 : result.count) || 0;
            }
            catch (error) {
                console.error('Database error in countQueueAllService:', error);
                throw new CustomErrors_1.DatabaseErrors('Failed to countQueueAllService method at Repository Layer');
            }
        });
    }
    countByServiceCount(_a) {
        return __awaiter(this, arguments, void 0, function* ({ service_id }) {
            try {
                const result = yield this.database('queue')
                    .count('* as count')
                    .where('type_id', service_id)
                    .andWhere('trans_date', 'DATE(NOW())')
                    .first();
                return Number(result === null || result === void 0 ? void 0 : result.count) || 0;
            }
            catch (error) {
                console.error('Database error in countByServiceCount:', error);
                throw new CustomErrors_1.DatabaseErrors('Failed to countQueueAllService method at Repository Layer');
            }
        });
    }
}
exports.QueueRepository = QueueRepository;
