import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Link } from './link.entity';

@Entity('link_categories')
export class LinkCategory {
  @ApiProperty({ description: '分类ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '分类名称' })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({ description: '分类描述', required: false })
  @Column({ length: 200, nullable: true })
  description: string;

  @ApiProperty({ description: '排序权重', default: 0 })
  @Column({ default: 0 })
  weight: number;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createTime: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updateTime: Date;

  @OneToMany(() => Link, (link) => link.category)
  links: Link[];
}
