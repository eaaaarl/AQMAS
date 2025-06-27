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
const DateMoment_1 = require("../libs/DateMoment");
class QueueRepository {
    constructor(database = database_1.db) {
        this.database = database;
        this.TABLE_NAME = 'queue';
        this.DETAIL_TABLE_NAME = 'queue_detail';
    }
    beginTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.database.transaction();
        });
    }
    handleDatabaseError(error, methodName) {
        console.error(`Database error in ${methodName}:`, error);
        throw new CustomErrors_1.DatabaseErrors(`Failed to execute operation in ${methodName} at Repository Layer`, error);
    }
    createQueue(payload, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = trx || this.database;
            try {
                const [newQueue] = yield db(this.TABLE_NAME)
                    .insert({
                    trans_id: payload.transId,
                    type_id: payload.typeId,
                    trans_status: payload.transStatus,
                    single_trans_only: payload.singleTransOnly,
                    customer_name: payload.customerName,
                    trans_date: (0, DateMoment_1.getTransDate)(),
                })
                    .returning('*');
                return newQueue;
            }
            catch (error) {
                this.handleDatabaseError(error, 'createQueue');
            }
        });
    }
    createQueueDetails(payload, trx) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = trx || this.database;
            try {
                const dataToInsert = payload.map(p => ({
                    trans_id: p.trans_id,
                    service_id: p.service_id,
                    trans_date: (0, DateMoment_1.getTransDate)(),
                }));
                const newQueueDetails = yield db(this.DETAIL_TABLE_NAME).insert(dataToInsert).returning('*');
                return newQueueDetails;
            }
            catch (error) {
                this.handleDatabaseError(error, 'createQueueDetails');
            }
        });
    }
    countQueue(_a) {
        return __awaiter(this, arguments, void 0, function* ({ Date, type_id }) {
            try {
                const result = yield this.database(this.TABLE_NAME)
                    .count('* as count')
                    .whereRaw(`${Date}`)
                    .andWhere('type_id', type_id)
                    .first();
                return parseInt(result === null || result === void 0 ? void 0 : result.count) || 1;
            }
            catch (error) {
                this.handleDatabaseError(error, 'countQueue');
            }
        });
    }
    countQueueAllService() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.database(this.DETAIL_TABLE_NAME)
                    .select(this.database.raw('COUNT(DISTINCT qd.trans_id) as count'))
                    .from(`${this.DETAIL_TABLE_NAME} as qd`)
                    .join('ent_service as es', 'qd.service_id', 'es.service_id')
                    .whereRaw('DATE(qd.trans_date) = CURDATE()')
                    .first();
                return Number(result === null || result === void 0 ? void 0 : result.count) || 1;
            }
            catch (error) {
                this.handleDatabaseError(error, 'countQueueAllService');
            }
        });
    }
    countByServiceCount(_a) {
        return __awaiter(this, arguments, void 0, function* ({ service_id }) {
            try {
                const result = yield this.database(this.DETAIL_TABLE_NAME)
                    .count('* as count')
                    .where('service_id', service_id)
                    .whereRaw('DATE(trans_date) = CURDATE()')
                    .first();
                return Number(result === null || result === void 0 ? void 0 : result.count) || 1;
            }
            catch (error) {
                this.handleDatabaseError(error, 'countByServiceCount');
            }
        });
    }
}
exports.QueueRepository = QueueRepository;
