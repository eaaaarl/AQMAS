import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface ServerConfig {
  host: string;
  port: number;
  environment: string;
}

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
}

export const appConfig: AppConfig = {
  server: {
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT || '3000', 10),
    environment: process.env.NODE_ENV || 'development',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'aqmas_db',
  },
}; 