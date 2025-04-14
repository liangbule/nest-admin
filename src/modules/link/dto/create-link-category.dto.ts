import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateLinkCategoryDto {
  @ApiProperty({ description: '分类名称' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '分类描述', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;

  @ApiProperty({ description: '排序权重', default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  weight?: number;
}
