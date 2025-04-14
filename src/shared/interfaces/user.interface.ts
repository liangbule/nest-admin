/**
 * 用户模块接口定义
 * 定义用户相关的数据结构和接口
 */

import { UserRole, UserStatus } from './auth.interface';

/**
 * 用户信息数据传输对象
 */
export interface UserDto {
  /**
   * 用户ID
   */
  id: string;

  /**
   * 用户名
   */
  username: string;

  /**
   * 真实姓名
   */
  realName: string;

  /**
   * 电话号码
   */
  phone: string;

  /**
   * 用户角色
   */
  role: UserRole;

  /**
   * 用户状态
   */
  status: UserStatus;

  /**
   * 创建时间
   */
  createdAt: string;

  /**
   * 更新时间
   */
  updatedAt: string;
}

/**
 * 创建用户请求参数
 */
export interface CreateUserDto {
  /**
   * 用户名
   */
  username: string;

  /**
   * 密码
   */
  password: string;

  /**
   * 真实姓名
   */
  realName: string;

  /**
   * 电话号码
   */
  phone: string;

  /**
   * 用户角色
   */
  role: UserRole;

  /**
   * 用户状态
   */
  status: UserStatus;
}

/**
 * 更新用户请求参数
 */
export interface UpdateUserDto {
  /**
   * 用户名
   */
  username?: string;

  /**
   * 密码
   */
  password?: string;

  /**
   * 真实姓名
   */
  realName?: string;

  /**
   * 电话号码
   */
  phone?: string;

  /**
   * 用户角色
   */
  role?: UserRole;

  /**
   * 用户状态
   */
  status?: UserStatus;
}

/**
 * 用户查询参数
 */
export interface UserQueryParams {
  /**
   * 用户名（模糊查询）
   */
  username?: string;

  /**
   * 真实姓名（模糊查询）
   */
  realName?: string;

  /**
   * 电话号码
   */
  phone?: string;

  /**
   * 用户角色
   */
  role?: UserRole;

  /**
   * 用户状态
   */
  status?: UserStatus;

  /**
   * 页码
   */
  page?: number;

  /**
   * 每页数量
   */
  limit?: number;
}
