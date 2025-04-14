import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { LinkCategory } from './link-category.entity';

@Entity('links')
export class Link extends BaseEntity {
  @ApiProperty({ description: '友链ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '网站名称' })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({ description: '网站链接' })
  @Column({ length: 200 })
  url: string;

  @ApiProperty({ description: '网站图标', required: false })
  @Column({ length: 200, nullable: true })
  icon: string;

  @ApiProperty({ description: '网站描述', required: false })
  @Column({ length: 200, nullable: true })
  description: string;

  @ApiProperty({ description: '排序权重', default: 0 })
  @Column({ default: 0 })
  weight: number;

  @ApiProperty({ description: '访问量', default: 0 })
  @Column({ default: 0 })
  views: number;

  @ApiProperty({
    description: '状态：0-待审核，1-已通过，2-已拒绝',
    default: 0,
  })
  @Column({ default: 0 })
  status: number;

  @ApiProperty({ description: '分类ID', required: false })
  @Column({ nullable: true })
  categoryId: number;

  @ApiProperty({ description: '分类' })
  @ManyToOne(() => LinkCategory, (category) => category.links)
  @JoinColumn({ name: 'category_id' })
  category: LinkCategory;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createTime: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updateTime: Date;

  @ApiProperty({ description: '删除时间', required: false })
  @DeleteDateColumn()
  deleteTime: Date;
}
