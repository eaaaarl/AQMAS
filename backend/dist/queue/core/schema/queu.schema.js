"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueSchema = void 0;
const zod_1 = require("zod");
exports.queueSchema = zod_1.z.object({
    trans_id: zod_1.z.string().min(1, 'Transaction id is required'),
    trans_date: zod_1.z.string(),
    type_id: zod_1.z.number().optional(),
    employee_id: zod_1.z.number().optional(),
    time_served: zod_1.z.date().optional(),
    time_end: zod_1.z.date().optional(),
    counter_no: zod_1.z.number().optional(),
    trans_status: zod_1.z.number().default(0),
    single_trans_only: zod_1.z.number().optional(),
});
