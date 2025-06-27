"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueByServiceCountSchema = exports.queueCountQuerySchema = exports.queueDetailsSchema = exports.queueSchema = void 0;
const zod_1 = require("zod");
exports.queueSchema = zod_1.z.object({
    transId: zod_1.z.string(),
    //trans_date: z.date().optional(),
    typeId: zod_1.z.number().optional(),
    transStatus: zod_1.z.number().default(0),
    singleTransOnly: zod_1.z.number().optional(),
    customerName: zod_1.z.string().optional(),
});
exports.queueDetailsSchema = zod_1.z.object({
    trans_id: zod_1.z.string(),
    trans_date: zod_1.z.string().optional(),
    service_id: zod_1.z.number(),
});
exports.queueCountQuerySchema = zod_1.z.object({
    Date: zod_1.z.string().optional(),
    type_id: zod_1.z.string().optional(),
});
exports.queueByServiceCountSchema = zod_1.z.object({
    service_id: zod_1.z.string().optional(),
});
