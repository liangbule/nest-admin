import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDecimal,
  Min,
  IsEnum,
  IsUUID,
  IsDateString,
  IsBoolean,
  IsDate,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 库存查询DTO
 */
export class InventoryQueryDto {
  @ApiProperty({ description: '页码', required: false, default: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ description: '每页数量', required: false, default: 10 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageSize?: number;

  @ApiProperty({ description: '搜索关键词', required: false })
  @IsString()
  @IsOptional()
  keyword?: string;

  @ApiProperty({
    description: '物品类别',
    required: false,
    enum: ['material', 'medicine', 'equipment', 'tool', 'other'],
  })
  @IsString()
  @IsOptional()
  @IsEnum(['material', 'medicine', 'equipment', 'tool', 'other'])
  type?: string;

  @ApiProperty({ description: '供应商', required: false })
  @IsString()
  @IsOptional()
  supplier?: string;

  @ApiProperty({ description: '库存预警（库存不足）', required: false })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  lowStock?: boolean;
}

/**
 * 库存类别枚举
 */
export enum InventoryCategory {
  MATERIAL = 'material', // 材料
  MEDICINE = 'medicine', // 药品
  EQUIPMENT = 'equipment', // 设备
  TOOL = 'tool', // 工具
  OTHER = 'other', // 其他
}

enum InventoryStatus {
  NORMAL = 'normal',
  WARNING = 'warning',
  EMPTY = 'empty',
}

/**
 * 创建库存DTO
 */
export class CreateInventoryDto {
  @ApiProperty({ description: '物品名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '物品编码' })
  @IsString()
  code: string;

  @ApiProperty({ description: '物品类别', enum: InventoryCategory })
  @IsEnum(InventoryCategory)
  type: InventoryCategory;

  @ApiProperty({ description: '规格型号' })
  @IsString()
  specification: string;

  @ApiProperty({ description: '计量单位' })
  @IsString()
  unit: string;

  @ApiProperty({ description: '库存数量' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  currentQuantity: number;

  @ApiProperty({ description: '安全库存' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  safetyQuantity: number;

  @ApiProperty({ description: '存放位置', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: '品牌/厂家', required: false })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({ description: '单价参考值', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  referencePrice?: number;

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
}

/**
 * 更新库存DTO
 */
export class UpdateInventoryDto {
  @ApiProperty({ description: '物品名称' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '物品编码' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ description: '物品类别', enum: InventoryCategory })
  @IsEnum(InventoryCategory)
  @IsOptional()
  type?: InventoryCategory;

  @ApiProperty({ description: '规格型号' })
  @IsString()
  @IsOptional()
  specification?: string;

  @ApiProperty({ description: '计量单位' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiProperty({ description: '库存数量' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  currentQuantity?: number;

  @ApiProperty({ description: '安全库存' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  safetyQuantity?: number;

  @ApiProperty({ description: '存放位置', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: '品牌/厂家', required: false })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({ description: '单价参考值', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  referencePrice?: number;

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
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

  @ApiProperty({
    description:
      '入库类型: purchase-采购, return-退货返回, transfer-调拨, other-其他',
  })
  @IsString()
  type: string;

  @ApiProperty({ description: '单价', required: false })
  @IsDecimal()
  @IsOptional()
  @Type(() => Number)
  unitPrice?: number;

  @ApiProperty({ description: '供应商/来源', required: false })
  @IsString()
  @IsOptional()
  supplier?: string;

  @ApiProperty({ description: '批次号', required: false })
  @IsString()
  @IsOptional()
  batchNumber?: string;

  @ApiProperty({ description: '生产日期', required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  productionDate?: Date;

  @ApiProperty({ description: '有效期至', required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  expirationDate?: Date;

  @ApiProperty({ description: '操作人' })
  @IsString()
  operator: string;

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
}

/**
 * 创建出库记录DTO
 */
export class CreateInventoryOutRecordDto {
  @ApiProperty({ description: '库存项ID' })
  @IsUUID()
  inventoryId: string;

  @ApiProperty({ description: '出库数量' })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description:
      '出库类型: use-使用, expired-过期, damaged-损坏, return-退货, transfer-调拨, other-其他',
    enum: ['use', 'expired', 'damaged', 'return', 'transfer', 'other'],
  })
  @IsString()
  type: string;

  @ApiProperty({ description: '批次号', required: false })
  @IsString()
  @IsOptional()
  batchNumber?: string;

  @ApiProperty({ description: '使用/出库目的', required: false })
  @IsString()
  @IsOptional()
  purpose?: string;

  @ApiProperty({ description: '关联患者ID', required: false })
  @IsUUID()
  @IsOptional()
  patientId?: string;

  @ApiProperty({ description: '关联医疗记录ID', required: false })
  @IsUUID()
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

/**
 * 批量导入库存DTO
 */
export class BatchImportInventoryDto {
  @ApiProperty({ description: '库存项列表', type: [CreateInventoryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInventoryDto)
  items: CreateInventoryDto[];
}

/**
 * 低库存预警查询DTO
 */
export class LowInventoryQueryDto extends InventoryQueryDto {
  @ApiProperty({
    description: '是否只显示库存不足的物品',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  onlyLow?: boolean = true;

  @ApiProperty({
    description: '是否只显示库存为空的物品',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  onlyEmpty?: boolean = false;

  @ApiProperty({
    description: '是否只显示低于安全库存的物品',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  belowSafety?: boolean = true;
}
