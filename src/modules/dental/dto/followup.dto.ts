import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsUUID,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum FollowupMethod {
  PHONE = 'phone',
  VISIT = 'visit',
  ONLINE = 'online',
}

export enum FollowupStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

/**
 * 创建随访记录DTO
 */
export class CreateFollowupDto {
  @ApiProperty({ description: '患者ID' })
  @IsNotEmpty({ message: '患者ID不能为空' })
  @IsUUID('4', { message: '患者ID格式不正确' })
  patientId: string;

  @ApiProperty({ description: '关联病历ID', required: false })
  @IsOptional()
  @IsUUID('4', { message: '医疗记录ID格式不正确' })
  medicalRecordId?: string;

  @ApiProperty({ description: '随访日期' })
  @IsNotEmpty({ message: '随访日期不能为空' })
  @IsDateString()
  followupDate: Date;

  @ApiProperty({
    description: '随访方式：phone-电话, visit-面诊, message-短信',
  })
  @IsNotEmpty({ message: '随访方式不能为空' })
  @IsString()
  followupType: string;

  @ApiProperty({ description: '随访内容' })
  @IsNotEmpty({ message: '随访内容不能为空' })
  @IsString()
  content: string;

  @ApiProperty({ description: '患者反馈', required: false })
  @IsOptional()
  @IsString()
  patientFeedback?: string;

  @ApiProperty({
    description: '状态：scheduled-计划中, completed-已完成, missed-未完成',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string = 'completed';

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: '随访人员' })
  @IsNotEmpty({ message: '随访人员不能为空' })
  @IsString()
  followedBy: string;

  @ApiProperty({ description: '下次随访日期', required: false })
  @IsDateString()
  @IsOptional()
  nextFollowupDate?: Date;
}

/**
 * 更新随访记录DTO
 */
export class UpdateFollowupDto {
  @ApiProperty({ description: '随访日期', required: false })
  @IsDateString()
  @IsOptional()
  followupDate?: Date;

  @ApiProperty({
    description: '随访方式：phone-电话, visit-面诊, message-短信',
    required: false,
  })
  @IsString()
  @IsOptional()
  followupType?: string;

  @ApiProperty({ description: '随访内容', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: '患者反馈', required: false })
  @IsString()
  @IsOptional()
  patientFeedback?: string;

  @ApiProperty({
    description: '状态：scheduled-计划中, completed-已完成, missed-未完成',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: '随访人员', required: false })
  @IsString()
  @IsOptional()
  followedBy?: string;

  @ApiProperty({ description: '下次随访日期', required: false })
  @IsDateString()
  @IsOptional()
  nextFollowupDate?: Date;
}

/**
 * 查询随访记录DTO
 */
export class FollowupQueryDto {
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
