import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsDate,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PatientGender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum PatientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

/**
 * 创建患者DTO
 */
export class CreatePatientDto {
  @ApiProperty({ description: '姓名', example: '张三' })
  @IsNotEmpty({ message: '姓名不能为空' })
  @IsString({ message: '姓名必须是字符串' })
  name: string;

  @ApiProperty({
    description: '性别',
    enum: PatientGender,
    example: PatientGender.MALE,
  })
  @IsNotEmpty({ message: '性别不能为空' })
  @IsEnum(PatientGender, { message: '性别必须是 male 或 female' })
  gender: PatientGender;

  @ApiProperty({ description: '出生日期', example: '1990-01-01' })
  @IsNotEmpty({ message: '出生日期不能为空' })
  @Type(() => Date)
  @IsDate({ message: '出生日期格式不正确' })
  birthday: Date;

  @ApiProperty({ description: '年龄', required: false, example: 30 })
  @IsOptional()
  @IsNumber({}, { message: '年龄必须是数字' })
  age?: number;

  @ApiProperty({ description: '电话号码', example: '13800138000' })
  @IsNotEmpty({ message: '电话号码不能为空' })
  @IsString({ message: '电话号码必须是字符串' })
  phone: string;

  @ApiProperty({
    description: '电子邮箱',
    required: false,
    example: 'example@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: '电子邮箱格式不正确' })
  email?: string;

  @ApiProperty({
    description: '地址',
    required: false,
    example: '北京市朝阳区',
  })
  @IsOptional()
  @IsString({ message: '地址必须是字符串' })
  address?: string;

  @ApiProperty({ description: '紧急联系人', required: false, example: '李四' })
  @IsOptional()
  @IsString({ message: '紧急联系人必须是字符串' })
  emergencyContact?: string;

  @ApiProperty({
    description: '紧急联系人电话',
    required: false,
    example: '13900139000',
  })
  @IsOptional()
  @IsString({ message: '紧急联系人电话必须是字符串' })
  emergencyPhone?: string;

  @ApiProperty({ description: '病史', required: false, example: '无特殊病史' })
  @IsOptional()
  @IsString({ message: '病史必须是字符串' })
  medicalHistory?: string;

  @ApiProperty({
    description: '过敏信息',
    required: false,
    example: '对青霉素过敏',
  })
  @IsOptional()
  @IsString({ message: '过敏信息必须是字符串' })
  allergies?: string;

  @ApiProperty({
    description: '状态',
    enum: PatientStatus,
    default: PatientStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(PatientStatus, { message: '状态必须是 active 或 inactive' })
  status?: PatientStatus;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString({ message: '备注必须是字符串' })
  notes?: string;
}

/**
 * 更新患者DTO
 */
export class UpdatePatientDto {
  @ApiProperty({ description: '姓名', required: false })
  @IsOptional()
  @IsString({ message: '姓名必须是字符串' })
  name?: string;

  @ApiProperty({ description: '性别', enum: PatientGender, required: false })
  @IsOptional()
  @IsEnum(PatientGender, { message: '性别必须是 male 或 female' })
  gender?: PatientGender;

  @ApiProperty({ description: '出生日期', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: '出生日期格式不正确' })
  birthday?: Date;

  @ApiProperty({ description: '年龄', required: false })
  @IsOptional()
  @IsNumber({}, { message: '年龄必须是数字' })
  age?: number;

  @ApiProperty({ description: '电话号码', required: false })
  @IsOptional()
  @IsString({ message: '电话号码必须是字符串' })
  phone?: string;

  @ApiProperty({ description: '电子邮箱', required: false })
  @IsOptional()
  @IsEmail({}, { message: '电子邮箱格式不正确' })
  email?: string;

  @ApiProperty({ description: '地址', required: false })
  @IsOptional()
  @IsString({ message: '地址必须是字符串' })
  address?: string;

  @ApiProperty({ description: '紧急联系人', required: false })
  @IsOptional()
  @IsString({ message: '紧急联系人必须是字符串' })
  emergencyContact?: string;

  @ApiProperty({ description: '紧急联系人电话', required: false })
  @IsOptional()
  @IsString({ message: '紧急联系人电话必须是字符串' })
  emergencyPhone?: string;

  @ApiProperty({ description: '病史', required: false })
  @IsOptional()
  @IsString({ message: '病史必须是字符串' })
  medicalHistory?: string;

  @ApiProperty({ description: '过敏信息', required: false })
  @IsOptional()
  @IsString({ message: '过敏信息必须是字符串' })
  allergies?: string;

  @ApiProperty({ description: '状态', enum: PatientStatus, required: false })
  @IsOptional()
  @IsEnum(PatientStatus, { message: '状态必须是 active 或 inactive' })
  status?: PatientStatus;

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString({ message: '备注必须是字符串' })
  notes?: string;
}

/**
 * 查询患者DTO
 */
export class PatientQueryDto {
  @ApiProperty({ description: '页码', required: false })
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiProperty({ description: '每页数量', required: false })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty({ description: '搜索关键词', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ description: '状态过滤', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
