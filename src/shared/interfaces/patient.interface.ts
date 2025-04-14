/**
 * 患者模块接口定义
 * 定义患者相关的数据结构和接口
 */

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
 * 患者信息数据传输对象
 */
export interface PatientDto {
  /**
   * 患者ID
   */
  id: string;

  /**
   * 患者姓名
   */
  name: string;

  /**
   * 性别
   */
  gender: PatientGender;

  /**
   * 年龄
   */
  age: number;

  /**
   * 出生日期
   */
  birthday: string;

  /**
   * 电话号码
   */
  phone: string;

  /**
   * 地址
   */
  address: string;

  /**
   * 病史
   */
  medicalHistory: string;

  /**
   * 患者状态
   */
  status: PatientStatus;

  /**
   * 最近一次就诊日期
   */
  lastVisit: string;

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
 * 创建患者请求参数
 */
export interface CreatePatientDto {
  /**
   * 患者姓名
   */
  name: string;

  /**
   * 性别
   */
  gender: PatientGender;

  /**
   * 出生日期
   */
  birthday: string;

  /**
   * 电话号码
   */
  phone: string;

  /**
   * 地址
   */
  address: string;

  /**
   * 病史
   */
  medicalHistory: string;
}

/**
 * 更新患者请求参数
 */
export interface UpdatePatientDto {
  /**
   * 患者姓名
   */
  name?: string;

  /**
   * 性别
   */
  gender?: PatientGender;

  /**
   * 出生日期
   */
  birthday?: string;

  /**
   * 电话号码
   */
  phone?: string;

  /**
   * 地址
   */
  address?: string;

  /**
   * 病史
   */
  medicalHistory?: string;

  /**
   * 患者状态
   */
  status?: PatientStatus;
}

/**
 * 患者查询参数
 */
export interface PatientQueryParams {
  /**
   * 患者姓名（模糊查询）
   */
  name?: string;

  /**
   * 性别
   */
  gender?: PatientGender;

  /**
   * 电话号码
   */
  phone?: string;

  /**
   * 患者状态
   */
  status?: PatientStatus;

  /**
   * 页码
   */
  page?: number;

  /**
   * 每页数量
   */
  limit?: number;
}
