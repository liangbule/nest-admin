import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Inventory } from './inventory.entity';

/**
 * 库存入库记录实体
 * 记录牙科诊所物品入库信息
 */
@Entity('dental_inventory_in_record')
export class InventoryInRecord {
  @ApiProperty({ description: '入库记录ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '入库数量' })
  @Column({ type: 'int' })
  quantity: number;

  @ApiProperty({ description: '入库类型: purchase-采购, return-退货返回, transfer-调拨, other-其他' })
  @Column()
  type: string;

  @ApiProperty({ description: '供应商/来源', required: false })
  @Column({ nullable: true })
  supplier: string;

  @ApiProperty({ description: '批次号', required: false })
  @Column({ nullable: true })
  batchNumber: string;

  @ApiProperty({ description: '生产日期', required: false })
  @Column({ type: 'date', nullable: true })
  productionDate: Date;

  @ApiProperty({ description: '有效期至', required: false })
  @Column({ type: 'date', nullable: true })
  expirationDate: Date;

  @ApiProperty({ description: '单价', type: 'number', required: false })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitPrice: number;

  @ApiProperty({ description: '总价', type: 'number', required: false })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalPrice: number;

  @ApiProperty({ description: '操作人' })
  @Column()
  operator: string;

  @ApiProperty({ description: '备注', required: false })
  @Column({ nullable: true, type: 'text' })
  remarks: string;
  
  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: '删除时间', required: false })
  @DeleteDateColumn()
  deleteTime: Date;

  // 关联关系
  @ApiProperty({ description: '关联库存ID' })
  @Column()
  inventoryId: string;

  @ManyToOne(() => Inventory, inventory => inventory.inRecords)
  @JoinColumn({ name: 'inventoryId' })
  inventory: Inventory;
} 