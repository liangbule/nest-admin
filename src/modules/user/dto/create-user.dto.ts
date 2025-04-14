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
 * 创建用户DTO
 * 定义创建用户时需要的数据结构
 * 包含数据验证和Swagger文档注解
 * 用于控制器接收客户端提交的用户创建请求
 */
export class CreateUserDto {
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
