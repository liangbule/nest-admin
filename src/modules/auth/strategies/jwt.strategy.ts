import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

/**
 * JWT认证策略
 * 实现基于JWT的用户认证机制
 * 负责验证请求中的JWT令牌并提取用户信息
 * 配置为Passport.js的策略之一
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('app.jwtSecret') || 'your_jwt_secret_key',
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }

      // 只返回必要的用户信息
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles
          ? user.roles.map((role) => ({
              id: role.id,
              name: role.name,
              description: role.description,
            }))
          : [],
      };
    } catch (error) {
      this.logger.error(`验证令牌失败: ${error.message}`, error.stack);
      throw error;
    }
  }
}
