"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const serviceSchema = zod_1.z.object({
    service_id: zod_1.z.number(),
    service_name: zod_1.z.string().min(1, "Service name is required"),
    button_caption: zod_1.z.string().optional(),
    priority_level: zod_1.z.number().int().optional(),
    service_format: zod_1.z.string().optional(),
    is_active: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.number().int().min(0).max(1), zod_1.z.null()])
        .optional()
        .transform((val) => (val === null ? undefined : Boolean(val))),
    header_id: zod_1.z
        .union([zod_1.z.number().int().gte(-32768).lte(32767), zod_1.z.null()])
        .optional(),
});
