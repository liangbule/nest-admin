import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 库存盘点记录DTO
 */
export class InventoryStockTakeItemDto {
  @ApiProperty({ description: '库存项ID' })
  @IsUUID()
  inventoryId: string;

  @ApiProperty({ description: '实际盘点数量' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  actualQuantity: number;

  @ApiProperty({ description: '差异原因', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}

/**
 * 创建库存盘点DTO
 */
export class CreateStockTakeDto {
  @ApiProperty({ description: '盘点批次编号', required: false })
  @IsString()
  @IsOptional()
  batchNumber?: string;

  @ApiProperty({ description: '盘点日期', required: false })
  @IsDateString()
  @IsOptional()
  stockTakeDate?: string;

  @ApiProperty({ description: '操作人' })
  @IsString()
  operator: string;

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiProperty({
    description: '盘点库存项列表',
    type: [InventoryStockTakeItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InventoryStockTakeItemDto)
  items: InventoryStockTakeItemDto[];
}

/**
 * 库存盘点查询DTO
 */
export class StockTakeQueryDto {
  @ApiProperty({ description: '页码', required: false, default: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ description: '每页数量', required: false, default: 10 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  pageSize?: number = 10;

  @ApiProperty({ description: '开始日期', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ description: '结束日期', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ description: '操作人', required: false })
  @IsString()
  @IsOptional()
  operator?: string;

  @ApiProperty({ description: '盘点批次号', required: false })
  @IsString()
  @IsOptional()
  batchNumber?: string;
}
