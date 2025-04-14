import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsNumber,
  IsUUID,
  IsBoolean,
  IsDateString,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum MedicalRecordStatus {
  COMPLETED = 'completed',
  ONGOING = 'ongoing',
  SCHEDULED = 'scheduled',
}

/**
 * 创建病历记录DTO
 */
export class CreateMedicalRecordDto {
  @ApiProperty({ description: '患者ID' })
  @IsNotEmpty({ message: '患者ID不能为空' })
  @IsUUID('4', { message: '患者ID格式不正确' })
  patientId: string;

  @ApiProperty({ description: '就诊日期' })
  @IsDateString()
  visitDate: Date;

  @ApiProperty({ description: '主诉' })
  @IsNotEmpty({ message: '主诉不能为空' })
  @IsString({ message: '主诉必须是字符串' })
  chiefComplaint: string;

  @ApiProperty({ description: '诊断结果' })
  @IsNotEmpty({ message: '诊断结果不能为空' })
  @IsString({ message: '诊断结果必须是字符串' })
  diagnosis: string;

  @ApiProperty({ description: '治疗方案' })
  @IsNotEmpty({ message: '治疗方案不能为空' })
  @IsString({ message: '治疗方案必须是字符串' })
  treatmentPlan: string;

  @ApiProperty({ description: '药物处方', required: false })
  @IsOptional()
  @IsString({ message: '药物处方必须是字符串' })
  prescription?: string;

  @ApiProperty({ description: '相关检查', required: false })
  @IsOptional()
  @IsString({ message: '相关检查必须是字符串' })
  examinations?: string;

  @ApiProperty({ description: '治疗备注', required: false })
  @IsOptional()
  @IsString({ message: '治疗备注必须是字符串' })
  treatmentNotes?: string;

  @ApiProperty({ description: '主治医生' })
  @IsNotEmpty({ message: '主治医生不能为空' })
  @IsString({ message: '主治医生必须是字符串' })
  attendingDoctor: string;

  @ApiProperty({ description: '治疗费用', required: false })
  @IsOptional()
  @IsNumber({}, { message: '治疗费用必须是数字' })
  cost?: number;

  @ApiProperty({ description: '状态：active-活跃，completed-完成', required: false })
  @IsOptional()
  @IsString({ message: '状态必须是 active 或 completed' })
  status?: string = 'active';

  @ApiProperty({ description: '照片URL数组', required: false, type: [String] })
  @IsArray()
  @IsOptional()
  photos?: string[];
}

/**
 * 更新病历记录DTO
 */
export class UpdateMedicalRecordDto {
  @ApiProperty({ description: '就诊日期', required: false })
  @IsDateString()
  @IsOptional()
  visitDate?: Date;

  @ApiProperty({ description: '主诉', required: false })
  @IsString()
  @IsOptional()
  chiefComplaint?: string;

  @ApiProperty({ description: '诊断结果', required: false })
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @ApiProperty({ description: '治疗方案', required: false })
  @IsString()
  @IsOptional()
  treatmentPlan?: string;

  @ApiProperty({ description: '药物处方', required: false })
  @IsString()
  @IsOptional()
  prescription?: string;

  @ApiProperty({ description: '相关检查', required: false })
  @IsString()
  @IsOptional()
  examinations?: string;

  @ApiProperty({ description: '治疗备注', required: false })
  @IsString()
  @IsOptional()
  treatmentNotes?: string;

  @ApiProperty({ description: '主治医生', required: false })
  @IsString()
  @IsOptional()
  attendingDoctor?: string;

  @ApiProperty({ description: '治疗费用', required: false })
  @IsNumber()
  @IsOptional()
  cost?: number;

  @ApiProperty({ description: '状态：active-活跃，completed-完成', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: '照片URL数组', required: false, type: [String] })
  @IsArray()
  @IsOptional()
  photos?: string[];
}

/**
 * 查询病历记录DTO
 */
export class MedicalRecordQueryDto {
  @ApiProperty({ description: '页码', required: false })
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiProperty({ description: '每页数量', required: false })
  @IsNumber()
  @IsOptional()
  limit?: number;
  
  @ApiProperty({ description: '状态过滤', required: false })
  @IsString()
  @IsOptional()
  status?: string;
}
