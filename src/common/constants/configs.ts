import * as dotenv from 'dotenv';
dotenv.config();
export const configs = {
  env: process.env.NODE_ENV,
  db: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret-key',
    expire: process.env.JWT_EXPIRE || '1d',
  },
};
