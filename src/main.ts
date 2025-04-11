import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

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
    .setTitle('Nest Admin API')
    .setDescription('Nest Admin API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

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
