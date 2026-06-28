import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
config();

export const {
  PORT = 5500,
  NODE_ENV = 'development',
  APP_NAME = 'TaskFlow API',
  CLIENT_URL = 'http://localhost:5173',
  DB_URI,
} = process.env;

