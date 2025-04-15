import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/**
 * 认证服务
 * 负责处理用户登录、注册和令牌验证等功能
 * 实现用户凭据验证、JWT令牌生成和验证
 * 与用户服务交互以验证用户信息
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByUsername(username);
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      this.logger.error(`用户验证失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  async login(user: any) {
    try {
      this.logger.log(`用户登录尝试: ${user.username}`);
      const payload = { username: user.username, sub: user.id };

      // 提取用户的基本信息和角色，避免循环引用
      const userResponse = {
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

      return {
        access_token: this.jwtService.sign(payload),
        user: userResponse,
      };
    } catch (error) {
      this.logger.error(`登录失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      // 创建新用户
      const user = await this.userService.create({
        ...registerDto,
        roleIds: registerDto.roleIds || [], // 使用传入的角色ID列表，如果没有则默认为空数组
      });

      this.logger.log(`用户注册成功: ${user.username}`);

      // 生成 JWT token
      const payload = { username: user.username, sub: user.id };
      const access_token = this.jwtService.sign(payload);

      // 提取用户的基本信息和角色，避免循环引用
      const userResponse = {
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

      return {
        access_token,
        user: userResponse,
      };
    } catch (error) {
      this.logger.error(`注册失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 刷新访问令牌
   * @param refreshToken 刷新令牌
   * @returns 新的访问令牌和刷新令牌
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // 验证刷新令牌
      const payload = this.jwtService.verify(refreshToken);
      
      // 检查用户是否存在
      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }

      // 生成新的访问令牌和刷新令牌
      const newAccessToken = this.jwtService.sign(
        { sub: user.id, username: user.username },
        { expiresIn: '1h' }
      );
      
      const newRefreshToken = this.jwtService.sign(
        { sub: user.id },
        { expiresIn: '7d' }
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      this.logger.error(`刷新令牌失败: ${error.message}`);
      throw new UnauthorizedException('无效的刷新令牌');
    }
  }
}
