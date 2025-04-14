/**
 * 医疗记录模块接口定义
 * 定义医疗记录相关的数据结构和接口
 */

/**
 * 医疗记录状态枚举
 */
export enum MedicalRecordStatus {
  COMPLETED = 'completed',
  ONGOING = 'ongoing',
  SCHEDULED = 'scheduled',
}

/**
 * 医疗记录数据传输对象
 */
export interface MedicalRecordDto {
  /**
   * 记录ID
   */
  id: string;

  /**
   * 患者ID
   */
  patientId: string;

  /**
   * 医生ID
   */
  doctorId: string;

  /**
   * 医生姓名
   */
  doctorName: string;

  /**
   * 就诊日期
   */
  visitDate: string;

  /**
   * 症状描述
   */
  symptoms: string;

  /**
   * 诊断结果
   */
  diagnosis: string;

  /**
   * 治疗方案
   */
  treatment: string;

  /**
   * 处方
   */
  prescription: string;

  /**
   * 备注
   */
  notes: string;

  /**
   * 下次复诊日期
   */
  nextVisit: string;

  /**
   * 记录状态
   */
  status: MedicalRecordStatus;

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
 * 创建医疗记录请求参数
 */
export interface CreateMedicalRecordDto {
  /**
   * 医生ID
   */
  doctorId: string;

  /**
   * 就诊日期
   */
  visitDate: string;

  /**
   * 症状描述
   */
  symptoms: string;

  /**
   * 诊断结果
   */
  diagnosis: string;

  /**
   * 治疗方案
   */
  treatment: string;

  /**
   * 处方
   */
  prescription: string;

  /**
   * 备注
   */
  notes: string;

  /**
   * 下次复诊日期
   */
  nextVisit: string;

  /**
   * 记录状态
   */
  status: MedicalRecordStatus;
}

/**
 * 更新医疗记录请求参数
 */
export interface UpdateMedicalRecordDto {
  /**
   * 医生ID
   */
  doctorId?: string;

  /**
   * 就诊日期
   */
  visitDate?: string;

  /**
   * 症状描述
   */
  symptoms?: string;

  /**
   * 诊断结果
   */
  diagnosis?: string;

  /**
   * 治疗方案
   */
  treatment?: string;

  /**
   * 处方
   */
  prescription?: string;

  /**
   * 备注
   */
  notes?: string;

  /**
   * 下次复诊日期
   */
  nextVisit?: string;

  /**
   * 记录状态
   */
  status?: MedicalRecordStatus;
}

/**
 * 医疗记录查询参数
 */
export interface MedicalRecordQueryParams {
  /**
   * 开始日期
   */
  startDate?: string;

  /**
   * 结束日期
   */
  endDate?: string;

  /**
   * 记录状态
   */
  status?: MedicalRecordStatus;

  /**
   * 页码
   */
  page?: number;

  /**
   * 每页数量
   */
  limit?: number;
}
