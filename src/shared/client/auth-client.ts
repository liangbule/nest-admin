/**
 * 认证模块客户端服务
 * 提供认证相关的API调用方法
 */
import { ApiClient } from './api-client';
import { ApiResponse, LoginDto, LoginResponseDto } from '../interfaces';

/**
 * 认证客户端服务类
 */
export class AuthClient {
  private readonly apiClient: ApiClient;

  /**
   * 构造函数
   * @param apiClient API客户端实例
   */
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * 用户登录
   * @param loginDto 登录参数
   * @returns Promise<ApiResponse<LoginResponseDto>>
   */
  async login(loginDto: LoginDto): Promise<ApiResponse<LoginResponseDto>> {
    const response = await this.apiClient.post<LoginResponseDto>(
      '/auth/login',
      loginDto,
    );

    // 如果登录成功，自动设置令牌
    if (response.success && response.data?.token) {
      this.apiClient.setToken(response.data.token);
    }

    return response;
  }

  /**
   * 用户登出
   * @returns Promise<ApiResponse<void>>
   */
  async logout(): Promise<ApiResponse<void>> {
    const response = await this.apiClient.post<void>('/auth/logout');
    return response;
  }
}
