import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('roles')
export class Role {
  @ApiProperty({ description: '角色ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '角色名称' })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({ description: '角色描述', required: false })
  @Column({ length: 200, nullable: true })
  description: string;

  @ApiProperty({ description: '状态（0-禁用，1-启用）' })
  @Column({ default: 1 })
  status: number;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
