"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransDate = getTransDate;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
function getTransDate() {
    return (0, moment_timezone_1.default)().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');
}
