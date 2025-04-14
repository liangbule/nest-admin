import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../role/entities/role.entity';

/**
 * 用户服务
 * 负责处理用户相关的业务逻辑
 * 包括用户的CRUD操作、用户认证信息处理等
 * 与数据库交互，管理用户数据持久化
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 创建用户实例
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      nickname: createUserDto.nickname || createUserDto.username,
      avatar: '',
      status: 1,
    });

    // 如果提供了角色ID，获取角色并关联
    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      const roles = await this.roleRepository.findBy({
        id: In(createUserDto.roleIds),
      });
      if (roles.length > 0) {
        user.roles = roles;
      }
    }

    // 保存用户及其关联
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['roles'],
    });
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
  }
}
