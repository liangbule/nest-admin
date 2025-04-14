import { SetMetadata } from '@nestjs/common';

/**
 * 角色装饰器
 * 用于标记需要特定角色才能访问的路由或控制器
 * 与RolesGuard配合使用实现基于角色的访问控制
 * 可以应用于控制器类或具体的路由处理方法
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
