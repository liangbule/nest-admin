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
import { Patient } from '../patient/entities/patient.entity';
import { MedicalRecord } from './medical-record.entity';

/**
 * 随访记录实体类
 * 定义随访记录在数据库中的数据结构和关系
 * 映射到数据库followups表
 */
@Entity('dental_followups')
export class Followup {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: '随访ID' })
  id: string;

  @ManyToOne(() => Patient, (patient) => patient.followups)
  @JoinColumn({ name: 'patientId' })
  @ApiProperty({ description: '患者' })
  patient: Patient;

  @Column({ name: 'patientId' })
  @ApiProperty({ description: '患者ID' })
  patientId: string;

  @ManyToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.followups)
  @JoinColumn({ name: 'medicalRecordId' })
  @ApiProperty({ description: '关联病历' })
  medicalRecord: MedicalRecord;

  @Column({ name: 'medicalRecordId', nullable: true })
  @ApiProperty({ description: '关联病历ID', required: false })
  medicalRecordId: string;

  @Column({ type: 'timestamp' })
  @ApiProperty({ description: '随访日期' })
  followupDate: Date;

  @Column()
  @ApiProperty({
    description: '随访方式：phone-电话, visit-面诊, message-短信',
  })
  followupType: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: '随访内容' })
  content: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: '患者反馈' })
  patientFeedback: string;

  @Column({ length: 50, default: 'completed' })
  @ApiProperty({
    description: '状态：scheduled-计划中, completed-已完成, missed-未完成',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: '备注' })
  notes: string;

  @Column()
  @ApiProperty({ description: '随访人员' })
  followedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: '下次随访日期', required: false })
  nextFollowupDate: Date;

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
