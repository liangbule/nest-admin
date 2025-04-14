import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';

/**
 * 用户实体类
 * 定义用户在数据库中的数据结构和关系
 * 映射到数据库users表
 * 包含用户的基本信息、认证信息和关联关系
 */
@Entity('users')
export class User {
  @ApiProperty({ description: '用户ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '用户名' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: '昵称' })
  @Column({ nullable: true })
  nickname: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ description: '邮箱' })
  @Column({ unique: true, nullable: true })
  email: string;

  @ApiProperty({ description: '头像' })
  @Column({ nullable: true })
  avatar: string;

  @ApiProperty({ description: '状态：0-禁用，1-启用' })
  @Column({ default: 1 })
  status: number;

  @ApiProperty({ description: '角色列表', type: [Role] })
  @ManyToMany(() => Role, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createTime: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updateTime: Date;
}
