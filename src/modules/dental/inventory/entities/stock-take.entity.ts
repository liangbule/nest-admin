import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { StockTakeItem } from './stock-take-item.entity';

/**
 * 库存盘点实体
 * 记录牙科诊所库存盘点信息
 */
@Entity('dental_stock_take')
export class StockTake {
  @ApiProperty({ description: '盘点ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '盘点批次号' })
  @Column({ name: 'batch_number', nullable: true })
  batchNumber: string;

  @ApiProperty({ description: '盘点日期' })
  @Column({ name: 'stock_take_date', type: 'date', nullable: true })
  stockTakeDate: Date;

  @ApiProperty({ description: '操作人' })
  @Column()
  operator: string;

  @ApiProperty({ description: '备注', required: false })
  @Column({ nullable: true, type: 'text' })
  remarks: string;

  @ApiProperty({ description: '盘点结果摘要', required: false })
  @Column({ name: 'result_summary', nullable: true, type: 'text' })
  resultSummary: string;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: '删除时间', required: false })
  @DeleteDateColumn({ name: 'delete_time' })
  deleteTime: Date;

  // 一对多关系：一次盘点包含多个盘点项
  @OneToMany(() => StockTakeItem, (item) => item.stockTake)
  items: StockTakeItem[];
}
