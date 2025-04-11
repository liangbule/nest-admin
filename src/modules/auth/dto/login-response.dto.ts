import { ApiProperty } from '@nestjs/swagger';

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
