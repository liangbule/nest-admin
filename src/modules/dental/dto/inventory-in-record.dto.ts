import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  Min, 
  IsUUID, 
  IsDateString,
  IsDecimal
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 入库记录查询DTO
 */
export class InventoryInRecordQueryDto {
  @ApiProperty({ description: '页码', default: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ description: '每页条数', default: 10 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 10;

  @ApiProperty({ description: '库存项ID', required: false })
  @IsUUID()
  @IsOptional()
  inventoryId?: string;

  @ApiProperty({ description: '开始日期', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ description: '结束日期', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ description: '供应商', required: false })
  @IsString()
  @IsOptional()
  supplier?: string;

  @ApiProperty({ description: '入库类型', required: false })
  @IsString()
  @IsOptional()
  type?: string;
}

/**
 * 创建入库记录DTO
 */
export class CreateInventoryInRecordDto {
  @ApiProperty({ description: '库存项ID' })
  @IsUUID()
  inventoryId: string;

  @ApiProperty({ description: '入库数量' })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ description: '入库类型', example: 'purchase', enum: ['purchase', 'return', 'transfer', 'other'] })
  @IsString()
  type: string;

  @ApiProperty({ description: '单价', required: false })
  @IsDecimal()
  @IsOptional()
  @Type(() => Number)
  unitPrice?: number;

  @ApiProperty({ description: '供应商', required: false })
  @IsString()
  @IsOptional()
  supplier?: string;

  @ApiProperty({ description: '批次号', required: false })
  @IsString()
  @IsOptional()
  batchNumber?: string;

  @ApiProperty({ description: '生产日期', required: false })
  @IsDateString()
  @IsOptional()
  productionDate?: string;

  @ApiProperty({ description: '有效期至', required: false })
  @IsDateString()
  @IsOptional()
  expirationDate?: string;

  @ApiProperty({ description: '操作人' })
  @IsString()
  operator: string;

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
} 