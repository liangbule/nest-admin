import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../user/entities/user.entity';

/**
 * 角色守卫
 * 实现基于用户角色的访问控制
 * 验证用户是否具有访问特定路由所需的角色
 * 通常与JwtAuthGuard一起使用，在身份验证后进行权限检查
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    return this.matchRoles(
      roles,
      user.roles.map((role) => role.name),
    );
  }

  private matchRoles(requiredRoles: string[], userRoles: string[]): boolean {
    return userRoles.some((role) => requiredRoles.includes(role));
  }
}
