/**
 * API客户端
 * 提供基础的HTTP请求方法和配置
 * 可在多个项目中共享使用
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '../interfaces';

/**
 * API客户端配置选项
 */
export interface ApiClientOptions {
  /**
   * API基础URL
   */
  baseURL: string;

  /**
   * 请求超时时间(ms)
   */
  timeout?: number;

  /**
   * 是否自动处理错误
   */
  handleError?: boolean;

  /**
   * 认证令牌
   */
  token?: string;

  /**
   * 请求头
   */
  headers?: Record<string, string>;
}

/**
 * API客户端类
 * 封装HTTP请求方法，提供统一的接口调用
 */
export class ApiClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly options: ApiClientOptions;

  /**
   * 构造函数
   * @param options API客户端配置选项
   */
  constructor(options: ApiClientOptions) {
    this.options = {
      timeout: 10000,
      handleError: true,
      ...options,
    };

    this.axiosInstance = axios.create({
      baseURL: this.options.baseURL,
      timeout: this.options.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...this.options.headers,
      },
    });

    // 请求拦截器
    this.axiosInstance.interceptors.request.use((config) => {
      // 如果有认证令牌，添加到请求头
      if (this.options.token) {
        config.headers.Authorization = `Bearer ${this.options.token}`;
      }
      return config;
    });

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (this.options.handleError) {
          // 处理错误响应
          const errorMessage =
            error.response?.data?.message || error.message || '请求失败';
          console.error(`API请求错误: ${errorMessage}`);
        }
        return Promise.reject(error);
      },
    );
  }

  /**
   * 设置认证令牌
   * @param token JWT令牌
   */
  setToken(token: string): void {
    this.options.token = token;
  }

  /**
   * 发起GET请求
   * @param url 请求URL
   * @param params 请求参数
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  async get<T>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> =
        await this.axiosInstance.get(url, {
          params,
          ...config,
        });
      return response.data;
    } catch (error) {
      if (!this.options.handleError) {
        throw error;
      }
      return { success: false, message: error.message };
    }
  }

  /**
   * 发起POST请求
   * @param url 请求URL
   * @param data 请求数据
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> =
        await this.axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      if (!this.options.handleError) {
        throw error;
      }
      return { success: false, message: error.message };
    }
  }

  /**
   * 发起PUT请求
   * @param url 请求URL
   * @param data 请求数据
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> =
        await this.axiosInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      if (!this.options.handleError) {
        throw error;
      }
      return { success: false, message: error.message };
    }
  }

  /**
   * 发起DELETE请求
   * @param url 请求URL
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> =
        await this.axiosInstance.delete(url, config);
      return response.data;
    } catch (error) {
      if (!this.options.handleError) {
        throw error;
      }
      return { success: false, message: error.message };
    }
  }
}
