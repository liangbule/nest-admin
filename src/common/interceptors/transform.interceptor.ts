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
 * 确保所有API响应具有一致的结构和格式
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
        // 根据返回数据类型进行处理
        if (data instanceof ApiResponseDto) {
          // 如果已经是ApiResponseDto实例，则直接返回
          return data;
        }

        // 对特殊数据类型的处理
        // 1. 空值处理
        if (data === null || data === undefined) {
          return ApiResponseDto.success(null as any);
        }

        // 2. 特定接口处理 - 例如分页数据
        if (
          data &&
          typeof data === 'object' &&
          'items' in data &&
          'total' in data
        ) {
          return ApiResponseDto.success({
            list: data.items,
            total: data.total,
            pageInfo: {
              currentPage: request.query.page || 1,
              pageSize: request.query.limit || 10,
            },
          } as any);
        }

        // 记录处理时间（仅在非生产环境）
        if (process.env.NODE_ENV !== 'production') {
          const duration = Date.now() - now;
          this.logger.log(
            `${method} ${url} ${context.getHandler().name} - ${duration}ms`,
          );
        }

        // 默认情况下，将数据包装为成功响应
        return ApiResponseDto.success(data);
      }),
    );
  }
}
