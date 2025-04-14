import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsOptional,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateLinkDto {
  @ApiProperty({ description: '网站名称' })
  @IsNotEmpty({ message: '网站名称不能为空' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '网站链接' })
  @IsNotEmpty({ message: '网站链接不能为空' })
  @IsUrl({}, { message: '请输入有效的网站链接' })
  @MaxLength(200)
  url: string;

  @ApiProperty({ description: '网站图标', required: false })
  @IsOptional()
  @IsUrl({}, { message: '请输入有效的图标链接' })
  @MaxLength(200)
  icon?: string;

  @ApiProperty({ description: '网站描述', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @ApiProperty({ description: '排序权重', default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  weight?: number;

  @ApiProperty({ description: '分类ID', required: false })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({
    description: '状态（0-禁用，1-启用）',
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  status?: number;
}
