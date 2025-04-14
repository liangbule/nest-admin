import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

/**
 * 应用程序入口文件
 * 负责创建、配置和启动NestJS应用程序实例
 * 设置全局前缀、中间件、验证管道、异常过滤器等
 * 配置Swagger API文档
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe());

  // 全局前缀
  const apiPrefix = configService.get('API_PREFIX', 'api');
  app.setGlobalPrefix(apiPrefix);

  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('牙科诊所管理系统API')
    .setDescription('牙科诊所管理系统API文档，包含患者管理、预约管理、病历管理和随访管理等功能')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('牙科诊所管理', '牙科诊所管理系统的所有API')
    .addTag('患者管理', '患者信息的增删改查')
    .addTag('预约管理', '患者预约的增删改查')
    .addTag('病历管理', '患者病历的增删改查')
    .addTag('随访管理', '患者随访记录的增删改查')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  // 全局注册响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 全局注册异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 获取端口
  const port = configService.get('PORT', 3000);

  // 启动应用
  await app.listen(port);

  // 打印文档和接口地址
  console.log('\n');
  console.log('==========================================');
  console.log(`🚀 应用已启动，访问以下地址：`);
  console.log(`📚 API 文档: http://localhost:${port}/${apiPrefix}/docs`);
  console.log(`🔌 API 接口: http://localhost:${port}/${apiPrefix}`);
  console.log('==========================================');
  console.log('\n');
}
bootstrap();
