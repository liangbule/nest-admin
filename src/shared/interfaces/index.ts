/**
 * 接口索引文件
 * 导出所有模块的接口定义，便于统一导入使用
 */

export * from './auth.interface';
export * from './user.interface';
export * from './patient.interface';
export * from './medical-record.interface';
export * from './appointment.interface';
export * from './followup.interface';

/**
 * 分页响应接口
 */
export interface PaginatedResponse<T> {
  /**
   * 总记录数
   */
  total: number;

  /**
   * 当前页数据列表
   */
  list: T[];
}

/**
 * 分页查询参数
 */
export interface PaginationParams {
  /**
   * 页码
   */
  page?: number;

  /**
   * 每页数量
   */
  limit?: number;
}

/**
 * 统一API响应格式
 */
export interface ApiResponse<T> {
  /**
   * 是否成功
   */
  success: boolean;

  /**
   * 响应消息
   */
  message: string;

  /**
   * 响应数据
   */
  data?: T;
}
