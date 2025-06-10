import dotenv from 'dotenv';
import { startApp } from './infrastructure/express-server/app';
import { db } from './infrastructure/database/database';

dotenv.config();

const initializeServer = async () => {
  try {
    try {
      db.raw('SELECT 1');
      console.log('Database connected successfully!');
    } catch (error) {
      console.error('Failed to connect to the database \n', error);
      process.exit(1);
    }

    const app = startApp();
    const port = parseInt(process.env.PORT || '3003');

    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start the server', error);
    process.exit(1);
  }
};

initializeServer();
