import { Injectable } from '@nestjs/common';

/**
 * 应用程序根服务
 * 提供应用程序级别的基本业务逻辑
 * 通常处理与控制器相关的通用功能
 */
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
