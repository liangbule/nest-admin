import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

/**
 * TypeORM数据源配置
 * 提供TypeORM CLI工具所需的数据库连接信息
 * 用于数据库迁移、生成和其他命令行操作
 * 从环境变量加载数据库连接参数
 */
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'my_nest_admin',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
  dropSchema: false,
  migrationsRun: true,
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
});
