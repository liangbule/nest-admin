/**
 * 客户端服务索引文件
 * 导出所有客户端服务类，便于统一使用
 */
import { ApiClient, ApiClientOptions } from './api-client';
import { AuthClient } from './auth-client';
import { UserClient } from './user-client';

export * from './api-client';
export * from './auth-client';
export * from './user-client';

/**
 * 创建API客户端
 * 工厂函数，创建基础API客户端实例
 * @param options API客户端配置选项
 * @returns API客户端实例
 */
export function createApiClient(options: ApiClientOptions): ApiClient {
  return new ApiClient(options);
}

/**
 * 创建认证客户端
 * 工厂函数，创建认证模块客户端服务
 * @param apiClient API客户端实例
 * @returns 认证客户端服务实例
 */
export function createAuthClient(apiClient: ApiClient): AuthClient {
  return new AuthClient(apiClient);
}

/**
 * 创建用户客户端
 * 工厂函数，创建用户模块客户端服务
 * @param apiClient API客户端实例
 * @returns 用户客户端服务实例
 */
export function createUserClient(apiClient: ApiClient): UserClient {
  return new UserClient(apiClient);
}

/**
 * 牙科诊所API服务
 * 整合所有模块的客户端服务
 */
export class DentalClinicApiService {
  /**
   * API客户端实例
   */
  readonly apiClient: ApiClient;

  /**
   * 认证模块客户端
   */
  readonly auth: AuthClient;

  /**
   * 用户模块客户端
   */
  readonly users: UserClient;

  /**
   * 构造函数
   * @param options API客户端配置选项
   */
  constructor(options: ApiClientOptions) {
    this.apiClient = createApiClient(options);
    this.auth = createAuthClient(this.apiClient);
    this.users = createUserClient(this.apiClient);
  }
}
