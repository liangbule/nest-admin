import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsNumber,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum AppointmentType {
  CHECKUP = 'checkup',
  TREATMENT = 'treatment',
  CONSULTATION = 'consultation',
  FOLLOWUP = 'followup',
}

/**
 * 创建预约DTO
 */
export class CreateAppointmentDto {
  @ApiProperty({ description: '患者ID' })
  @IsNotEmpty({ message: '患者ID不能为空' })
  @IsUUID('4', { message: '患者ID格式不正确' })
  patientId: string;

  @ApiProperty({ description: '预约时间' })
  @IsDateString()
  appointmentTime: Date;

  @ApiProperty({ description: '预约时长（分钟）', required: false })
  @IsNumber()
  @IsOptional()
  duration?: number = 30;

  @ApiProperty({ description: '预约类型' })
  @IsNotEmpty({ message: '预约类型不能为空' })
  @IsString({ message: '预约类型必须是字符串' })
  type: string;

  @ApiProperty({ description: '预约原因', required: false })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({
    description: '预约状态：scheduled, completed, cancelled, no-show',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string = 'scheduled';

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

/**
 * 更新预约DTO
 */
export class UpdateAppointmentDto {
  @ApiProperty({ description: '预约时间', required: false })
  @IsDateString()
  @IsOptional()
  appointmentTime?: Date;

  @ApiProperty({ description: '预约时长（分钟）', required: false })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({ description: '预约类型', required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: '预约原因', required: false })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({
    description: '预约状态：scheduled, completed, cancelled, no-show',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

/**
 * 查询预约DTO
 */
export class AppointmentQueryDto {
  @ApiProperty({ description: '页码', required: false })
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiProperty({ description: '每页数量', required: false })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty({ description: '患者ID', required: false })
  @IsUUID()
  @IsOptional()
  patientId?: string;

  @ApiProperty({ description: '预约状态', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: '开始日期', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: '结束日期', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: Date;
}
