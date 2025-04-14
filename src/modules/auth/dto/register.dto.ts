import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
} from 'class-validator';

/**
 * 注册DTO
 * 定义用户注册时需要提交的数据结构
 * 包含创建新用户所需的字段和验证规则
 * 应用数据验证和Swagger文档注解
 */
export class RegisterDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  username: string;

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度不能小于6位' })
  password: string;

  @ApiProperty({ description: '昵称' })
  @IsString({ message: '昵称必须是字符串' })
  @IsOptional()
  nickname?: string;

  @ApiProperty({ description: '邮箱' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsOptional()
  email?: string;

  @ApiProperty({ description: '角色ID列表', type: [Number] })
  @IsArray({ message: '角色ID列表必须是数组' })
  @IsOptional()
  roleIds?: number[];
}
