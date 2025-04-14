import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('banners')
export class Banner {
  @ApiProperty({ description: '轮播图ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '标题' })
  @Column({ length: 100 })
  title: string;

  @ApiProperty({ description: '图片URL' })
  @Column({ name: 'image_url' })
  imageUrl: string;

  @ApiProperty({ description: '链接URL' })
  @Column({ name: 'link_url', nullable: true })
  linkUrl: string;

  @ApiProperty({ description: '排序值（值越大越靠前）' })
  @Column({ default: 0 })
  sort: number;

  @ApiProperty({ description: '状态（0-禁用，1-启用）' })
  @Column({ default: 1 })
  status: number;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;
}
