import bodyParser from 'body-parser';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { serviceRoutes } from '../../service/service.route';
import { configRoute } from '../../config/config.route';
import { queueRoute } from '../../queue/queue.route';
import { errorHandler } from '../middleware/errorHandler';
import { customerRoute } from '../../customer/customer.route';
import { NotFoundError } from '../../libs/CustomErrors';

export const startApp = () => {
  const app = express();

  //Security Middleware
  app.use(
    cors({
      origin: '*',
      credentials: true,
    }),
  );

  //Body Parser Middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());

  //Core Routes
  app.use(serviceRoutes);
  app.use(configRoute);
  app.use('/queue', queueRoute);
  app.use('/customer', customerRoute);

  // Handle 404 - Not Found
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(
      new NotFoundError(
        `The requested resource for ${req.method} on ${req.originalUrl} was not found.`,
      ),
    );
  });

  //Error Handler
  app.use(errorHandler);
  return app;
};
