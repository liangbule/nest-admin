import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({ description: '标题' })
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString()
  title: string;

  @ApiProperty({ description: '图片URL' })
  @IsNotEmpty({ message: '图片URL不能为空' })
  @IsUrl({}, { message: '请输入有效的图片URL' })
  imageUrl: string;

  @ApiProperty({ description: '链接URL', required: false })
  @IsOptional()
  @IsUrl({}, { message: '请输入有效的链接URL' })
  linkUrl?: string;

  @ApiProperty({ description: '排序值', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sort?: number;

  @ApiProperty({
    description: '状态（0-禁用，1-启用）',
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  status?: number;
}
