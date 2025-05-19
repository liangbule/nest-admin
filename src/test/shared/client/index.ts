/**
 * 牙科诊所API服务
 * 整合所有模块的客户端服务
 */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * API客户端配置选项
 */
export interface ApiClientOptions extends AxiosRequestConfig {
  /**
   * 是否自动处理错误
   */
  handleError?: boolean;
}

/**
 * 牙科诊所API服务类
 */
export class DentalClinicApiService {
  /**
   * axios实例
   */
  private axiosInstance: AxiosInstance;

  /**
   * 是否自动处理错误
   */
  private handleError: boolean;

  /**
   * 认证模块
   */
  auth: any;

  /**
   * 用户模块
   */
  users: any;

  /**
   * 构造函数
   * @param options API客户端配置选项
   */
  constructor(options: ApiClientOptions) {
    const { handleError = true, ...axiosOptions } = options;
    this.handleError = handleError;

    // 创建axios实例
    this.axiosInstance = axios.create({
      ...axiosOptions,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // 实现各模块API
    this.auth = {
      login: async (data: any) => {
        try {
          const response = await this.axiosInstance.post('/auth/login', data);
          return response.data;
        } catch (error) {
          this.handleApiError(error);
          throw error;
        }
      },
      logout: async () => {
        try {
          const response = await this.axiosInstance.post('/auth/logout');
          return response.data;
        } catch (error) {
          this.handleApiError(error);
          throw error;
        }
      },
    };

    this.users = {
      getUsers: async (params: any) => {
        try {
          const response = await this.axiosInstance.get('/users', { params });
          return response.data;
        } catch (error) {
          this.handleApiError(error);
          throw error;
        }
      },
      getUser: async (id: string) => {
        try {
          const response = await this.axiosInstance.get(`/users/${id}`);
          return response.data;
        } catch (error) {
          this.handleApiError(error);
          throw error;
        }
      },
      createUser: async (data: any) => {
        try {
          const response = await this.axiosInstance.post('/users', data);
          return response.data;
        } catch (error) {
          this.handleApiError(error);
          throw error;
        }
      },
      updateUser: async (id: string, data: any) => {
        try {
          const response = await this.axiosInstance.put(`/users/${id}`, data);
          return response.data;
        } catch (error) {
          this.handleApiError(error);
          throw error;
        }
      },
      deleteUser: async (id: string) => {
        try {
          const response = await this.axiosInstance.delete(`/users/${id}`);
          return response.data;
        } catch (error) {
          this.handleApiError(error);
          throw error;
        }
      },
    };
  }

  /**
   * 处理API错误
   * @param error Axios错误对象
   */
  private handleApiError(error: any): void {
    if (!this.handleError) return;

    // 处理不同类型的错误
    if (error.response) {
      console.error('API错误:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('请求错误:', '无响应');
    } else {
      console.error('请求设置错误:', error.message);
    }
  }
} 