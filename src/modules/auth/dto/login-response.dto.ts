import { ApiProperty } from '@nestjs/swagger';

/**
 * 登录响应DTO
 * 定义登录成功后返回给客户端的数据结构
 * 包含用户令牌和基本信息
 * 用于统一API响应格式
 */
export class LoginResponseDto {
  @ApiProperty({ description: '访问令牌' })
  accessToken: string;

  @ApiProperty({ description: '用户信息' })
  user: {
    id: number;
    username: string;
    email: string;
    roles: string[];
  };
}
