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
const queue_route_1 = __importDefault(require("../../queue/queue.route"));
const errorHandler_1 = require("../middleware/errorHandler");
const customer_route_1 = require("../../customer/customer.route");
const CustomErrors_1 = require("../../libs/CustomErrors");
const startApp = () => {
    const app = (0, express_1.default)();
    //Security Middleware
    app.use((0, cors_1.default)({
        origin: '*',
        credentials: true,
    }));
    //Body Parser Middleware
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    //Core Routes
    app.use('/api/v1/service', service_route_1.serviceRoutes);
    app.use('/api/v1/config', config_route_1.configRoute);
    app.use('/api/v1/queue', queue_route_1.default);
    app.use('/api/v1/customer', customer_route_1.customerRoute);
    // Handle 404 - Not Found
    app.use((req, res, next) => {
        next(new CustomErrors_1.NotFoundError(`The requested resource for ${req.method} on ${req.originalUrl} was not found.`));
    });
    //Error Handler
    app.use(errorHandler_1.errorHandler);
    return app;
};
exports.startApp = startApp;
