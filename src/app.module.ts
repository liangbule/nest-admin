import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { ArticleModule } from './modules/article/article.module';
import { BannerModule } from './modules/banner/banner.module';
import { LinkModule } from './modules/link/link.module';
import { DentalModule } from './modules/dental/dental.module';
import { getDatabaseConfig } from './config/database.config';
import { LoggerMiddleware } from './middleware/logger.middleware';

/**
 * 应用程序根模块
 * 负责导入和组织应用程序的所有子模块和提供者
 * 配置全局模块如ConfigModule、TypeOrmModule等
 * 注册应用程序的核心功能模块和中间件
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    RoleModule,
    ArticleModule,
    BannerModule,
    LinkModule,
    DentalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
