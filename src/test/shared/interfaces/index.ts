/**
 * 接口索引文件
 * 导出所有模块的接口定义，便于统一导入使用
 */

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

/**
 * 患者性别枚举
 */
export enum PatientGender {
  MALE = 'male',
  FEMALE = 'female',
}

/**
 * 患者状态枚举
 */
export enum PatientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

/**
 * 医疗记录状态枚举
 */
export enum MedicalRecordStatus {
  COMPLETED = 'completed',
  ONGOING = 'ongoing',
  SCHEDULED = 'scheduled',
}

/**
 * 预约状态枚举
 */
export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

/**
 * 预约类型枚举
 */
export enum AppointmentType {
  CHECKUP = 'checkup',
  TREATMENT = 'treatment',
  CONSULTATION = 'consultation',
  FOLLOWUP = 'followup',
}

/**
 * 随访方式枚举
 */
export enum FollowupMethod {
  PHONE = 'phone',
  SMS = 'sms',
  EMAIL = 'email',
  VISIT = 'visit',
}

/**
 * 随访状态枚举
 */
export enum FollowupStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

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