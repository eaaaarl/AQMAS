import { startApp } from './infrastructure/express-server/app';
import { db } from './infrastructure/database/database';
import { appConfig } from './config/core/app.config';
import { logger } from './infrastructure/logger/logger';
import { Server } from 'http';

let server: Server;

const initializeServer = async () => {
  try {
    // Database connection check
    try {
      await db.raw('SELECT 1');
      logger.info('Database connected successfully!');
    } catch (error: any) {
      logger.error('Failed to connect to the database:', { error: error.message });
      process.exit(1);
    }

    // Initialize Express app
    const app = startApp();

    // Start server
    server = app.listen(appConfig.server.port, appConfig.server.host, () => {
      logger.info(`Server is running on ${appConfig.server.host}:${appConfig.server.port}`);
      logger.info(`Environment: ${appConfig.server.environment}`);
    });
  } catch (error: any) {
    logger.error('Failed to start the server:', { error: error.message });
    process.exit(1);
  }
};

const shutdown = (signal: string) => {
  logger.warn(`${signal} received, shutting down gracefully.`);
  if (server) {
    server.close(() => {
      logger.info('Server closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
  shutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
  shutdown('unhandledRejection');
});

// Graceful shutdown
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

initializeServer();
