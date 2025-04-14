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
import { Patient } from './patient.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 预约实体类
 * 定义预约在数据库中的数据结构和关系
 * 映射到数据库appointments表
 */
@Entity('dental_appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: '预约ID' })
  id: string;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  @JoinColumn({ name: 'patientId' })
  @ApiProperty({ description: '患者' })
  patient: Patient;

  @Column({ name: 'patientId' })
  @ApiProperty({ description: '患者ID' })
  patientId: string;

  @Column({ type: 'timestamp' })
  @ApiProperty({ description: '预约时间' })
  appointmentTime: Date;

  @Column({ type: 'int', default: 30 })
  @ApiProperty({ description: '预约时长（分钟）' })
  duration: number;

  @Column()
  @ApiProperty({ description: '预约类型' })
  type: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: '预约原因' })
  reason: string;

  @Column({ default: 'scheduled' })
  @ApiProperty({
    description: '预约状态：scheduled, completed, cancelled, no-show',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: '备注' })
  notes: string;

  @CreateDateColumn()
  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间' })
  updateTime: Date;

  @DeleteDateColumn()
  @ApiProperty({ description: '删除时间' })
  deleteTime: Date;
}
