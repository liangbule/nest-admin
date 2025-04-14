import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

/**
 * 角色服务
 * 负责处理角色相关的业务逻辑
 * 包括角色的创建、查询、更新和删除
 * 与数据库交互，管理角色数据的持久化
 */
@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      where: {
        status: 1, // 只返回启用的角色
      },
      order: {
        createTime: 'DESC',
      },
    });
  }

  async findAllAdmin(): Promise<Role[]> {
    return await this.roleRepository.find({
      order: {
        createTime: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`角色ID ${id} 不存在`);
    }
    return role;
  }

  async update(
    id: number,
    updateRoleDto: Partial<CreateRoleDto>,
  ): Promise<Role> {
    const role = await this.findOne(id);
    Object.assign(role, updateRoleDto);
    return await this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }
}
