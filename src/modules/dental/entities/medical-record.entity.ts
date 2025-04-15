import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Patient } from '../patient/entities/patient.entity';
import { Followup } from './followup.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 医疗记录实体类
 * 定义医疗记录在数据库中的数据结构和关系
 * 映射到数据库medical_records表
 */
@Entity('dental_medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: '病历ID' })
  id: string;

  @ManyToOne(() => Patient, (patient) => patient.medicalRecords)
  @JoinColumn({ name: 'patientId' })
  @ApiProperty({ description: '患者' })
  patient: Patient;

  @Column({ name: 'patientId' })
  @ApiProperty({ description: '患者ID' })
  patientId: string;

  @Column({ type: 'timestamp' })
  @ApiProperty({ description: '就诊日期' })
  visitDate: Date;

  @Column()
  @ApiProperty({ description: '主治医生' })
  dentistName: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: '症状描述' })
  symptoms: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: '诊断结果' })
  diagnosis: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: '治疗方案' })
  treatmentPlan: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: '用药信息' })
  medications: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: '备注' })
  notes: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty({ description: '治疗费用' })
  cost: number;

  @Column({ default: false })
  @ApiProperty({ description: '是否已结账' })
  isPaid: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间' })
  updateTime: Date;

  @DeleteDateColumn()
  @ApiProperty({ description: '删除时间' })
  deleteTime: Date;

  @OneToMany(() => Followup, (followup) => followup.medicalRecord)
  @ApiProperty({ description: '随访记录', type: [Followup] })
  followups: Followup[];
}
