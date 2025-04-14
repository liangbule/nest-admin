import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInventoryOutRecordDto {
  @ApiProperty({ description: '库存物品ID' })
  @IsUUID()
  inventoryId: string;

  @ApiProperty({ description: '出库数量' })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ description: '出库类型: use-使用, expired-过期, damaged-损坏, return-退货, transfer-调拨, other-其他', enum: ['use', 'expired', 'damaged', 'return', 'transfer', 'other'] })
  @IsString()
  type: string;

  @ApiProperty({ description: '批次号', required: false })
  @IsString()
  @IsOptional()
  batchNumber?: string;

  @ApiProperty({ description: '用途', required: false })
  @IsString()
  @IsOptional()
  purpose?: string;

  @ApiProperty({ description: '患者ID', required: false })
  @IsString()
  @IsOptional()
  patientId?: string;

  @ApiProperty({ description: '病历ID', required: false })
  @IsString()
  @IsOptional()
  medicalRecordId?: string;

  @ApiProperty({ description: '操作人' })
  @IsString()
  operator: string;

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
}

export class UpdateInventoryOutRecordDto extends PartialType(CreateInventoryOutRecordDto) {}

export class InventoryOutRecordQueryDto {
  @ApiProperty({ description: '页码', required: false, default: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ description: '每页数量', required: false, default: 10 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 10;

  @ApiProperty({ description: '库存物品ID', required: false })
  @IsString()
  @IsOptional()
  inventoryId?: string;

  @ApiProperty({ description: '出库类型', required: false, enum: ['use', 'expired', 'damaged', 'return', 'transfer', 'other'] })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: '开始日期', required: false })
  @IsDateString()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({ description: '结束日期', required: false })
  @IsDateString()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
} 