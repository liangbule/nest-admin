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
import { Inventory } from './inventory.entity';

/**
 * 库存出库记录实体
 * 记录牙科诊所物品出库信息
 */
@Entity('dental_inventory_out_record')
export class InventoryOutRecord {
  @ApiProperty({ description: '出库记录ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '出库数量' })
  @Column({ type: 'int' })
  quantity: number;

  @ApiProperty({
    description:
      '出库类型: use-使用, expired-过期, damaged-损坏, return-退货, transfer-调拨, other-其他',
  })
  @Column()
  type: string;

  @ApiProperty({ description: '批次号', required: false })
  @Column({ name: 'batch_number', nullable: true })
  batchNumber: string;

  @ApiProperty({ description: '使用/出库目的', required: false })
  @Column({ nullable: true })
  purpose: string;

  @ApiProperty({ description: '关联患者ID', required: false })
  @Column({ name: 'patient_id', nullable: true })
  patientId: string;

  @ApiProperty({ description: '关联医疗记录ID', required: false })
  @Column({ name: 'medical_record_id', nullable: true })
  medicalRecordId: string;

  @ApiProperty({ description: '操作人' })
  @Column()
  operator: string;

  @ApiProperty({ description: '备注', required: false })
  @Column({ nullable: true, type: 'text' })
  remarks: string;

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
  @ApiProperty({ description: '关联库存ID' })
  @Column({ name: 'inventory_id' })
  inventoryId: string;

  @ManyToOne(() => Inventory, (inventory) => inventory.outRecords)
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;
}
