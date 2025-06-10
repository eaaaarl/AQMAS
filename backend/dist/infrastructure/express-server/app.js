"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startApp = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const service_route_1 = require("../../service/service.route");
const config_route_1 = require("../../config/config.route");
const startApp = () => {
    const app = (0, express_1.default)();
    //Security Middleware
    app.use((0, cors_1.default)({
        origin: "*",
        credentials: true,
    }));
    //Body Parser Middleware
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    //Core Routes
    app.use("/api/user", service_route_1.serviceRoutes);
    app.use("/api", config_route_1.configRoute);
    return app;
};
exports.startApp = startApp;
