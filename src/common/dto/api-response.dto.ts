import { ApiProperty } from '@nestjs/swagger';

/**
 * API响应数据传输对象
 * 定义API返回的统一响应格式
 * 包含状态码、消息和数据字段
 * 确保所有API响应具有一致的结构
 */
export class ApiResponseDto<T> {
  @ApiProperty({ description: '状态码' })
  code: number;

  @ApiProperty({ description: '消息' })
  message: string;

  @ApiProperty({ description: '数据' })
  data: T;

  @ApiProperty({ description: '时间戳' })
  timestamp: number;

  @ApiProperty({ description: '错误详情', required: false })
  errors?: Record<string, any>;

  constructor(
    code: number,
    message: string,
    data: T,
    errors?: Record<string, any>,
  ) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.timestamp = Date.now();
    this.errors = errors;
  }

  static success<T>(data: T, message = 'success'): ApiResponseDto<T> {
    return new ApiResponseDto(200, message, data);
  }

  static error<T>(
    message: string,
    code = 500,
    data: T = null,
    errors?: Record<string, any>,
  ): ApiResponseDto<T> {
    return new ApiResponseDto(code, message, data, errors);
  }

  static badRequest<T>(
    message = '请求参数错误',
    errors?: Record<string, any>,
  ): ApiResponseDto<T> {
    return new ApiResponseDto(400, message, null, errors);
  }

  static unauthorized<T>(message = '未授权访问'): ApiResponseDto<T> {
    return new ApiResponseDto(401, message, null);
  }

  static forbidden<T>(message = '禁止访问'): ApiResponseDto<T> {
    return new ApiResponseDto(403, message, null);
  }

  static notFound<T>(message = '资源不存在'): ApiResponseDto<T> {
    return new ApiResponseDto(404, message, null);
  }
}
