import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';

/**
 * 用户模块
 * 负责组织和封装用户功能相关的组件
 * 导入TypeORM实体并注册控制器和服务
 * 可以被其他模块导入以使用用户功能
 */
@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
