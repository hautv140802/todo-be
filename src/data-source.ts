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
  entities: [path.join(__dirname, '/entities/**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, '/migrations/*.{ts,js}')],
  synchronize: false,
  logging: configs.env !== 'production',
});

console.log('Migration files:', AppDataSource.options.migrations);
