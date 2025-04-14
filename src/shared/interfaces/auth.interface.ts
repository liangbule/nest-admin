/**
 * 认证模块接口定义
 * 定义登录、登出等认证相关的接口
 */

/**
 * 登录请求参数
 */
export interface LoginDto {
  /**
   * 用户名
   */
  username: string;

  /**
   * 密码
   */
  password: string;

  /**
   * 验证码（可选）
   */
  captcha?: string;
}

/**
 * 登录响应数据
 */
export interface LoginResponseDto {
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
   * 用户角色
   */
  role: 'admin' | 'doctor' | 'staff';

  /**
   * JWT令牌
   */
  token: string;
}

/**
 * 用户角色枚举
 */
export enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  STAFF = 'staff',
}

/**
 * 用户状态枚举
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
