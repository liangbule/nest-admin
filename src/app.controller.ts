import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * 应用程序根控制器
 * 处理应用程序级别的基本路由请求
 * 如健康检查、首页或其他通用端点
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
