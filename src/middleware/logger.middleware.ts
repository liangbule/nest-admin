import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

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
