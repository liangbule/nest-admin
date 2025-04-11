import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(createUserDto: {
    username: string;
    password: string;
    email: string;
    roleIds?: number[];
  }): Promise<User> {
    // 检查用户名是否已存在
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('用户名或邮箱已存在');
    }

    // 创建新用户
    const user = this.usersRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: await bcrypt.hash(createUserDto.password, 10),
    });

    // 如果提供了角色ID，则添加角色
    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      const roles = await this.rolesRepository.findByIds(createUserDto.roleIds);
      user.roles = roles;
    }

    return this.usersRepository.save(user);
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async assignRoles(userId: number, roleIds: number[]): Promise<User> {
    const user = await this.findOne(userId);
    const roles = await this.rolesRepository.findByIds(roleIds);

    if (roles.length !== roleIds.length) {
      throw new NotFoundException('某些角色不存在');
    }

    user.roles = roles;
    return this.usersRepository.save(user);
  }
}
