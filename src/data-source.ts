import { DataSource } from 'typeorm';
import path from 'path';
import * as dotenv from 'dotenv';
import { configs } from './common/constants/configs';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configs.db.host,
  port: configs.db.port,
  username: configs.db.username,
  password: configs.db.password,
  database: configs.db.database,
  entities: [path.resolve(__dirname, './entities/*.{js, ts}')],
  migrations: [path.resolve(__dirname, './migrations/.{js, ts}')],
  synchronize: false,
  logging: configs.env !== 'production',
});

console.log('Migration files:', AppDataSource.options.migrations);
