/**
 * 随访记录模块接口定义
 * 定义随访记录相关的数据结构和接口
 */

/**
 * 随访记录状态枚举
 */
export enum FollowupStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

/**
 * 随访方式枚举
 */
export enum FollowupMethod {
  PHONE = 'phone',
  VISIT = 'visit',
  ONLINE = 'online',
}

/**
 * 随访记录数据传输对象
 */
export interface FollowupDto {
  /**
   * 随访记录ID
   */
  id: string;

  /**
   * 患者ID
   */
  patientId: string;

  /**
   * 医疗记录ID
   */
  medicalRecordId: string;

  /**
   * 随访日期
   */
  followUpDate: string;

  /**
   * 随访方式
   */
  method: FollowupMethod;

  /**
   * 随访内容
   */
  content: string;

  /**
   * 随访结果
   */
  result: string;

  /**
   * 下次随访日期
   */
  nextFollowUp: string;

  /**
   * 随访状态
   */
  status: FollowupStatus;

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
 * 创建随访记录请求参数
 */
export interface CreateFollowupDto {
  /**
   * 医疗记录ID
   */
  medicalRecordId: string;

  /**
   * 随访日期
   */
  followUpDate: string;

  /**
   * 随访方式
   */
  method: FollowupMethod;

  /**
   * 随访内容
   */
  content: string;

  /**
   * 随访结果
   */
  result: string;

  /**
   * 下次随访日期
   */
  nextFollowUp: string;

  /**
   * 随访状态
   */
  status: FollowupStatus;
}

/**
 * 更新随访记录请求参数
 */
export interface UpdateFollowupDto {
  /**
   * 随访日期
   */
  followUpDate?: string;

  /**
   * 随访方式
   */
  method?: FollowupMethod;

  /**
   * 随访内容
   */
  content?: string;

  /**
   * 随访结果
   */
  result?: string;

  /**
   * 下次随访日期
   */
  nextFollowUp?: string;

  /**
   * 随访状态
   */
  status?: FollowupStatus;
}

/**
 * 随访记录查询参数
 */
export interface FollowupQueryParams {
  /**
   * 开始日期
   */
  startDate?: string;

  /**
   * 结束日期
   */
  endDate?: string;

  /**
   * 随访状态
   */
  status?: FollowupStatus;

  /**
   * 页码
   */
  page?: number;

  /**
   * 每页数量
   */
  limit?: number;
}
