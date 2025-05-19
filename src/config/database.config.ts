import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

/**
 * 数据库配置
 * 提供TypeORM所需的数据库连接和配置选项
 * 从环境变量加载配置，支持不同环境的配置切换
 * 用于应用程序的数据库初始化
 */

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isDevelopment = configService.get<string>('NODE_ENV') !== 'production';

  return {
    type: 'mysql',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 3306),
    username: configService.get<string>('DB_USERNAME', 'root'),
    password: configService.get<string>('DB_PASSWORD', 'root'),
    database: configService.get<string>('DB_DATABASE', 'my_nest_admin'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    // 开发环境下启用synchronize以自动更新表结构
    synchronize:
      isDevelopment && configService.get<boolean>('DB_SYNCHRONIZE', false),
    logging: configService.get<boolean>('DB_LOGGING', true),
    dropSchema: false,
    migrationsRun: true,
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    autoLoadEntities: true,
  };
};
