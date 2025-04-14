import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('articles')
export class Article {
  @ApiProperty({ description: '文章ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '标题' })
  @Column({ length: 100 })
  title: string;

  @ApiProperty({ description: '内容' })
  @Column('text')
  content: string;

  @ApiProperty({ description: '摘要' })
  @Column({ length: 255, nullable: true })
  summary: string;

  @ApiProperty({ description: '封面图片' })
  @Column({ length: 255, nullable: true })
  coverImage: string;

  @ApiProperty({ description: '状态：0-草稿，1-已发布' })
  @Column({ default: 0 })
  status: number;

  @ApiProperty({ description: '浏览量' })
  @Column({ default: 0 })
  views: number;

  @ApiProperty({ description: '作者ID' })
  @Column()
  authorId: number;

  @ApiProperty({ description: '作者', type: User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createTime: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updateTime: Date;
}
