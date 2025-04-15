import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';

/**
 * 响应转换拦截器
 * 统一处理控制器返回的响应数据
 * 将返回数据包装成标准的API响应格式
 * 优化响应结构，减少嵌套层级
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto<T>>
{
  private readonly logger = new Logger(TransformInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T>> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      map((data) => {
        // 记录处理时间（仅在非生产环境）
        if (process.env.NODE_ENV !== 'production') {
          const duration = Date.now() - now;
          this.logger.log(
            `${method} ${url} ${context.getHandler().name} - ${duration}ms`,
          );
        }

        // 如果已经是ApiResponseDto实例，则直接返回
        if (data instanceof ApiResponseDto) {
          return data;
        }

        // 对于牙科模块特有的嵌套结构进行扁平化处理
        if (data && typeof data === 'object' && 'success' in data) {
          // 从牙科模块的嵌套响应中提取数据
          const { success, message, data: responseData } = data;

          // 直接返回扁平化的响应结构
          return {
            code: success ? 200 : 400,
            message,
            data: responseData,
            timestamp: Date.now(),
          } as ApiResponseDto<any>;
        }

        // 对特殊数据类型的处理
        // 1. 空值处理
        if (data === null || data === undefined) {
          return ApiResponseDto.success(null as any);
        }

        // 2. 分页数据扁平化处理
        if (
          data &&
          typeof data === 'object' &&
          'items' in data &&
          'meta' in data
        ) {
          // 扁平化分页数据结构
          return ApiResponseDto.success({
            list: data.items,
            total: data.meta.total,
            page: data.meta.page,
            pageSize: data.meta.pageSize,
            totalPages: data.meta.totalPages,
          } as any);
        }

        // 默认情况下，将数据包装为成功响应
        return ApiResponseDto.success(data);
      }),
    );
  }
}
