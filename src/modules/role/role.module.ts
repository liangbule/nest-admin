import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';

/**
 * 角色模块
 * 负责组织和封装角色管理相关的组件
 * 导入TypeORM实体并注册控制器和服务
 * 管理系统中的角色定义和分配
 */
@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
