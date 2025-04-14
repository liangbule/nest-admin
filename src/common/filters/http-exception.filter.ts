import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  ValidationError,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseDto } from '../dto/api-response.dto';
import { QueryFailedError } from 'typeorm';

/**
 * HTTP异常过滤器
 * 捕获应用程序中抛出的所有HTTP异常
 * 统一异常处理和响应格式
 * 记录错误信息并返回客户端友好的错误响应
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const requestUrl = request.url;
    const method = request.method;
    const timestamp = new Date().toISOString();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let errorDetails: Record<string, any> = null;

    // 处理各种类型的异常
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        exception instanceof BadRequestException &&
        Array.isArray(exceptionResponse['message'])
      ) {
        // 处理验证错误
        message = '请求参数验证失败';
        const validationErrors = exceptionResponse['message'] as string[];

        // 转换验证错误为结构化格式
        errorDetails = {
          fields: {},
          validationErrors,
        };

        // 尝试提取字段级错误
        validationErrors.forEach((error) => {
          const match = error.match(/^(.+?) (.+)$/);
          if (match) {
            const field = match[1];
            const errorMsg = match[2];
            if (!errorDetails.fields[field]) {
              errorDetails.fields[field] = [];
            }
            errorDetails.fields[field].push(errorMsg);
          }
        });
      } else {
        message = exceptionResponse['message'] || '服务器内部错误';
        // 保留原始错误响应中的其他信息
        if (typeof exceptionResponse === 'object') {
          errorDetails = { ...exceptionResponse };
          delete errorDetails.message; // 避免重复消息
          delete errorDetails.statusCode; // 避免重复状态码

          // 如果errorDetails为空对象，则设置为null
          if (Object.keys(errorDetails).length === 0) {
            errorDetails = null;
          }
        }
      }
    }
    // 处理TypeORM查询错误
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      message = '数据库操作失败';
      errorDetails = {
        type: 'QueryFailedError',
        code: (exception as any).code,
        detail: (exception as any).detail || (exception as any).message,
      };
    }
    // 处理标准Error对象
    else if (exception instanceof Error) {
      message = exception.message || '服务器内部错误';
      errorDetails = {
        name: exception.name,
        stack:
          process.env.NODE_ENV === 'production' ? undefined : exception.stack,
      };
    }

    // 记录详细错误信息
    this.logger.error(
      `异常 [${method} ${requestUrl}] - 状态: ${status} - 消息: ${message} - 时间: ${timestamp}`,
      exception instanceof Error ? exception.stack : '',
    );

    // 打印更多详细错误信息（仅开发环境）
    if (process.env.NODE_ENV !== 'production') {
      console.error(exception);
    }

    // 构建响应
    const errorResponse = ApiResponseDto.error(
      message,
      status,
      null,
      errorDetails,
    );

    // 发送响应
    response.status(status).json(errorResponse);
  }
}
