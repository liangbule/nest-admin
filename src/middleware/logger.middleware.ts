import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * 日志中间件
 * 记录应用程序的HTTP请求和响应信息
 * 提供请求跟踪和调试支持
 * 可配置不同级别的日志记录详细程度
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body } = req;
    const userAgent = req.get('user-agent') || '';
    const start = Date.now();

    // 请求开始时的日志
    this.logger.log(
      `⤵️ ${method} ${originalUrl} - ${userAgent}${
        Object.keys(body).length
          ? `\n请求体: ${JSON.stringify(body, null, 2)}`
          : ''
      }`,
    );

    // 监听响应结束事件
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const duration = Date.now() - start;

      // 请求结束时的日志
      this.logger.log(
        `⤴️ ${method} ${originalUrl} ${statusCode} ${contentLength}B - ${duration}ms`,
      );
    });

    next();
  }
}
