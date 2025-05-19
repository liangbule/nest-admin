import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * 刷新令牌DTO
 * 用于处理令牌刷新请求
 */
export class RefreshTokenDto {
  @ApiProperty({ description: '刷新令牌' })
  @IsString()
  refreshToken: string;
}
