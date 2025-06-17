"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueByServiceCountSchema = exports.queueCountQuerySchema = exports.queueDetailsSchema = exports.queueSchema = void 0;
const zod_1 = require("zod");
exports.queueSchema = zod_1.z.object({
    trans_id: zod_1.z.string(),
    trans_date: zod_1.z.date().optional(),
    type_id: zod_1.z.number().optional(),
    employee_id: zod_1.z.number().optional(),
    time_served: zod_1.z.date().optional(),
    time_end: zod_1.z.date().optional(),
    counter_no: zod_1.z.number().optional(),
    trans_status: zod_1.z.number().default(0),
    single_trans_only: zod_1.z.number().optional(),
    customer_name: zod_1.z.string().optional(),
});
exports.queueDetailsSchema = zod_1.z.object({
    trans_id: zod_1.z.string().min(1, 'trans_id is required'),
    trans_date: zod_1.z.string().optional(),
    service_id: zod_1.z.number().min(1, 'service_id is required'),
});
exports.queueCountQuerySchema = zod_1.z.object({
    Date: zod_1.z.string().optional(),
    type_id: zod_1.z.number().optional(),
});
exports.queueByServiceCountSchema = zod_1.z.object({
    service_id: zod_1.z.string().optional(),
});
