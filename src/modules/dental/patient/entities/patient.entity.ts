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
import { MedicalRecord } from '../../entities/medical-record.entity';
import { Appointment } from '../../appointment/entities/appointment.entity';
import { Followup } from '../../entities/followup.entity';

/**
 * 患者实体类
 * 定义患者在数据库中的数据结构和关系
 * 映射到数据库patients表
 */
@Entity('dental_patients')
export class Patient {
  @ApiProperty({ description: '患者ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '姓名' })
  @Column()
  name: string;

  @ApiProperty({ description: '性别：male-男，female-女' })
  @Column({ nullable: true })
  gender: string;

  @ApiProperty({ description: '出生日期' })
  @Column({ nullable: true })
  birthdate: Date;

  @ApiProperty({ description: '年龄', required: false })
  @Column({ nullable: true })
  age: number;

  @ApiProperty({ description: '电话号码' })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ description: '电子邮箱', required: false })
  @Column({ nullable: true })
  email: string;

  @ApiProperty({ description: '地址', required: false })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({ description: '紧急联系人', required: false })
  @Column({ nullable: true })
  emergencyContact: string;

  @ApiProperty({ description: '紧急联系人电话', required: false })
  @Column({ nullable: true })
  emergencyPhone: string;

  @ApiProperty({ description: '病史', required: false })
  @Column({ type: 'text', nullable: true })
  medicalHistory: string;

  @ApiProperty({ description: '过敏信息', required: false })
  @Column({ type: 'text', nullable: true })
  allergies: string;

  @ApiProperty({ description: '状态：active-活跃，inactive-不活跃' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: '备注', required: false })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createTime: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updateTime: Date;

  @ApiProperty({ description: '删除时间', required: false })
  @DeleteDateColumn()
  deleteTime: Date;

  // 关联关系
  @ApiProperty({ description: '病历记录', type: () => [MedicalRecord] })
  @OneToMany(() => MedicalRecord, (record: any) => record.patient)
  medicalRecords: MedicalRecord[];

  @ApiProperty({ description: '预约记录', type: () => [Appointment] })
  @OneToMany(() => Appointment, (appointment: any) => appointment.patient)
  appointments: Appointment[];

  @ApiProperty({ description: '随访记录', type: () => [Followup] })
  @OneToMany(() => Followup, (followup: any) => followup.patient)
  followups: Followup[];
}
