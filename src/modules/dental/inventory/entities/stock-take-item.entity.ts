import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { StockTake } from './stock-take.entity';
import { Inventory } from './inventory.entity';

/**
 * 库存盘点项实体
 * 记录牙科诊所库存盘点详情
 */
@Entity('dental_stock_take_item')
export class StockTakeItem {
  @ApiProperty({ description: '盘点项ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '盘点ID' })
  @Column({ name: 'stock_take_id' })
  stockTakeId: string;

  @ApiProperty({ description: '库存项ID' })
  @Column({ name: 'inventory_id' })
  inventoryId: string;

  @ApiProperty({ description: '系统记录数量' })
  @Column({ name: 'system_quantity', type: 'int' })
  systemQuantity: number;

  @ApiProperty({ description: '实际盘点数量' })
  @Column({ name: 'actual_quantity', type: 'int' })
  actualQuantity: number;

  @ApiProperty({ description: '差异数量' })
  @Column({ name: 'difference', type: 'int' })
  difference: number;

  @ApiProperty({ description: '差异原因', required: false })
  @Column({ nullable: true, type: 'text' })
  reason: string;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: '删除时间', required: false })
  @DeleteDateColumn({ name: 'delete_time' })
  deleteTime: Date;

  // 多对一关系：多个盘点项属于一次盘点
  @ManyToOne(() => StockTake, (stockTake) => stockTake.items)
  @JoinColumn({ name: 'stock_take_id' })
  stockTake: StockTake;

  // 多对一关系：多个盘点项关联到一个库存项
  @ManyToOne(() => Inventory)
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;
}
