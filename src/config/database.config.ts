import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'mysql',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 3306),
  username: configService.get('DB_USERNAME', 'admin'),
  password: configService.get('DB_PASSWORD', 'admin123'),
  database: configService.get('DB_DATABASE', 'nest_admin'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: configService.get('DB_SYNCHRONIZE', true),
  logging: configService.get('DB_LOGGING', true),
});
