/**
 * 预约模块接口定义
 * 定义预约相关的数据结构和接口
 */

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
 * 预约数据传输对象
 */
export interface AppointmentDto {
  /**
   * 预约ID
   */
  id: string;

  /**
   * 患者ID
   */
  patientId: string;

  /**
   * 患者姓名
   */
  patientName: string;

  /**
   * 医生ID
   */
  doctorId: string;

  /**
   * 医生姓名
   */
  doctorName: string;

  /**
   * 预约日期
   */
  date: string;

  /**
   * 预约时间
   */
  time: string;

  /**
   * 持续时间（分钟）
   */
  duration: number;

  /**
   * 预约类型
   */
  type: AppointmentType;

  /**
   * 预约状态
   */
  status: AppointmentStatus;

  /**
   * 备注
   */
  notes: string;

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
 * 创建预约请求参数
 */
export interface CreateAppointmentDto {
  /**
   * 患者ID
   */
  patientId: string;

  /**
   * 医生ID
   */
  doctorId: string;

  /**
   * 预约日期
   */
  date: string;

  /**
   * 预约时间
   */
  time: string;

  /**
   * 持续时间（分钟）
   */
  duration: number;

  /**
   * 预约类型
   */
  type: AppointmentType;

  /**
   * 备注
   */
  notes: string;
}

/**
 * 更新预约请求参数
 */
export interface UpdateAppointmentDto {
  /**
   * 患者ID
   */
  patientId?: string;

  /**
   * 医生ID
   */
  doctorId?: string;

  /**
   * 预约日期
   */
  date?: string;

  /**
   * 预约时间
   */
  time?: string;

  /**
   * 持续时间（分钟）
   */
  duration?: number;

  /**
   * 预约类型
   */
  type?: AppointmentType;

  /**
   * 预约状态
   */
  status?: AppointmentStatus;

  /**
   * 备注
   */
  notes?: string;
}

/**
 * 预约查询参数
 */
export interface AppointmentQueryParams {
  /**
   * 医生ID
   */
  doctorId?: string;

  /**
   * 患者ID
   */
  patientId?: string;

  /**
   * 开始日期
   */
  startDate?: string;

  /**
   * 结束日期
   */
  endDate?: string;

  /**
   * 预约状态
   */
  status?: AppointmentStatus;

  /**
   * 预约类型
   */
  type?: AppointmentType;

  /**
   * 页码
   */
  page?: number;

  /**
   * 每页数量
   */
  limit?: number;
}
