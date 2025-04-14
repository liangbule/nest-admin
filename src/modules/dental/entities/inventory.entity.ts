import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { InventoryInRecord } from './inventory-in-record.entity';
import { InventoryOutRecord } from './inventory-out-record.entity';

/**
 * 库存实体类
 * 用于管理牙科诊所的耗材、药品、设备等库存信息
 */
@Entity('dental_inventory')
export class Inventory {
  @ApiProperty({ description: '库存ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '物品名称' })
  @Column()
  name: string;

  @ApiProperty({ description: '物品编码' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ description: '物品类型: material-耗材, medicine-药品, equipment-设备, tool-工具, other-其他' })
  @Column()
  type: string;

  @ApiProperty({ description: '规格' })
  @Column()
  specification: string;

  @ApiProperty({ description: '单位' })
  @Column()
  unit: string;

  @ApiProperty({ description: '当前库存数量' })
  @Column({ type: 'int', default: 0, name: 'current_quantity' })
  currentQuantity: number;

  @ApiProperty({ description: '安全库存量' })
  @Column({ type: 'int', default: 0, name: 'safety_quantity' })
  safetyQuantity: number;

  @ApiProperty({ description: '存放位置', required: false })
  @Column({ nullable: true })
  location: string;

  @ApiProperty({ description: '品牌/厂家', required: false })
  @Column({ nullable: true })
  manufacturer: string;

  @ApiProperty({ description: '单价参考值', type: 'number', required: false })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'reference_price' })
  referencePrice: number;

  @ApiProperty({ description: '备注', required: false })
  @Column({ nullable: true, type: 'text' })
  remarks: string;

  @ApiProperty({ description: '状态: active-启用, inactive-停用' })
  @Column({ default: 'active' })
  status: string;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: '删除时间', required: false })
  @DeleteDateColumn({ name: 'delete_time' })
  deleteTime: Date;

  // 关联关系
  @OneToMany(() => InventoryInRecord, inRecord => inRecord.inventory)
  inRecords: InventoryInRecord[];

  @OneToMany(() => InventoryOutRecord, outRecord => outRecord.inventory)
  outRecords: InventoryOutRecord[];
} 