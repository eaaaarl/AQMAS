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
const app_1 = require("./infrastructure/express-server/app");
const database_1 = require("./infrastructure/database/database");
const app_config_1 = require("./config/core/app.config");
const logger_1 = require("./infrastructure/logger/logger");
let server;
const initializeServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Database connection check
        try {
            yield database_1.db.raw('SELECT 1');
            logger_1.logger.info('Database connected successfully!');
        }
        catch (error) {
            logger_1.logger.error('Failed to connect to the database:', { error: error.message });
            process.exit(1);
        }
        // Initialize Express app
        const app = (0, app_1.startApp)();
        // Start server
        server = app.listen(app_config_1.appConfig.server.port, app_config_1.appConfig.server.host, () => {
            logger_1.logger.info(`Server is running on ${app_config_1.appConfig.server.host}:${app_config_1.appConfig.server.port}`);
            logger_1.logger.info(`Environment: ${app_config_1.appConfig.server.environment}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start the server:', { error: error.message });
        process.exit(1);
    }
});
const shutdown = (signal) => {
    logger_1.logger.warn(`${signal} received, shutting down gracefully.`);
    if (server) {
        server.close(() => {
            logger_1.logger.info('Server closed.');
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
};
// Handle uncaught exceptions
process.on('uncaughtException', error => {
    logger_1.logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
    shutdown('uncaughtException');
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('Unhandled Rejection at:', { promise, reason });
    shutdown('unhandledRejection');
});
// Graceful shutdown
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
initializeServer();
