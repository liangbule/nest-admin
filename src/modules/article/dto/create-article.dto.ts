import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  MinLength,
} from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ description: '标题' })
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString({ message: '标题必须是字符串' })
  @MinLength(2, { message: '标题长度不能小于2个字符' })
  title: string;

  @ApiProperty({ description: '内容' })
  @IsNotEmpty({ message: '内容不能为空' })
  @IsString({ message: '内容必须是字符串' })
  content: string;

  @ApiProperty({ description: '摘要' })
  @IsString({ message: '摘要必须是字符串' })
  @IsOptional()
  summary?: string;

  @ApiProperty({ description: '封面图片' })
  @IsString({ message: '封面图片必须是字符串' })
  @IsOptional()
  coverImage?: string;

  @ApiProperty({ description: '状态：0-草稿，1-已发布' })
  @IsNumber()
  @IsOptional()
  status?: number;
}
