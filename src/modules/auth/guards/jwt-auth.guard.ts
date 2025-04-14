import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT认证守卫
 * 使用Passport JWT策略保护需要认证的路由
 * 验证请求中的JWT令牌是否有效
 * 作为路由级中间件应用于需要保护的端点
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
