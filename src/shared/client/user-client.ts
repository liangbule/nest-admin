/**
 * 用户模块客户端服务
 * 提供用户管理相关的API调用方法
 */
import { ApiClient } from './api-client';
import {
  ApiResponse,
  CreateUserDto,
  PaginatedResponse,
  UpdateUserDto,
  UserDto,
  UserQueryParams,
} from '../interfaces';

/**
 * 用户客户端服务类
 */
export class UserClient {
  private readonly apiClient: ApiClient;
  private readonly baseUrl = '/users';

  /**
   * 构造函数
   * @param apiClient API客户端实例
   */
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * 获取用户列表
   * @param queryParams 查询参数
   * @returns Promise<ApiResponse<PaginatedResponse<UserDto>>>
   */
  async getUsers(
    queryParams: UserQueryParams = {},
  ): Promise<ApiResponse<PaginatedResponse<UserDto>>> {
    return this.apiClient.get<PaginatedResponse<UserDto>>(
      this.baseUrl,
      queryParams,
    );
  }

  /**
   * 获取单个用户信息
   * @param userId 用户ID
   * @returns Promise<ApiResponse<UserDto>>
   */
  async getUser(userId: string): Promise<ApiResponse<UserDto>> {
    return this.apiClient.get<UserDto>(`${this.baseUrl}/${userId}`);
  }

  /**
   * 创建用户
   * @param createUserDto 创建用户参数
   * @returns Promise<ApiResponse<UserDto>>
   */
  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<ApiResponse<UserDto>> {
    return this.apiClient.post<UserDto>(this.baseUrl, createUserDto);
  }

  /**
   * 更新用户信息
   * @param userId 用户ID
   * @param updateUserDto 更新用户参数
   * @returns Promise<ApiResponse<UserDto>>
   */
  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<UserDto>> {
    return this.apiClient.put<UserDto>(
      `${this.baseUrl}/${userId}`,
      updateUserDto,
    );
  }

  /**
   * 删除用户
   * @param userId 用户ID
   * @returns Promise<ApiResponse<void>>
   */
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return this.apiClient.delete<void>(`${this.baseUrl}/${userId}`);
  }
}
