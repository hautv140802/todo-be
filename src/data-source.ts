import { DataSource } from 'typeorm';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();
const isProd = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [path.resolve(__dirname, './entities/*.{js, ts}')],
  migrations: [path.resolve(__dirname, './migrations/.{js, ts}')],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
});

console.log('Migration files:', AppDataSource.options.migrations);
