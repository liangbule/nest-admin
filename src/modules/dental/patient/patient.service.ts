import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import {
  CreatePatientDto,
  UpdatePatientDto,
  PatientQueryDto,
} from './dto/patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  /**
   * 获取患者列表，支持分页、过滤和排序
   */
  async getPatients(query: PatientQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.patientRepository.createQueryBuilder('patient');

    // 搜索条件
    if (search) {
      queryBuilder.where(
        '(patient.name LIKE :search OR patient.phone LIKE :search OR patient.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页
    queryBuilder.skip(skip).take(limit);

    // 排序
    queryBuilder.orderBy('patient.createTime', 'DESC');

    // 执行查询
    const patients = await queryBuilder.getMany();

    return {
      code: 200,
      message: '获取患者列表成功',
      data: {
        items: patients,
        total,
        page: Number(page),
        pageSize: Number(limit),
      },
    };
  }

  /**
   * 获取单个患者的详细信息
   */
  async getPatient(id: string) {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['appointments', 'medicalRecords', 'followups'],
    });

    if (!patient) {
      throw new NotFoundException(`未找到ID为${id}的患者`);
    }

    return {
      code: 200,
      message: '获取患者详情成功',
      data: patient,
    };
  }

  /**
   * 创建新患者
   */
  async createPatient(patientData: CreatePatientDto) {
    const patient = this.patientRepository.create(patientData);
    const savedPatient = await this.patientRepository.save(patient);

    return {
      code: 200,
      message: '创建患者成功',
      data: savedPatient,
    };
  }

  /**
   * 更新患者信息
   */
  async updatePatient(id: string, patientData: UpdatePatientDto) {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`未找到ID为${id}的患者`);
    }

    // 合并数据
    const updatedPatient = { ...patient, ...patientData };
    await this.patientRepository.save(updatedPatient);

    return {
      code: 200,
      message: '更新患者信息成功',
      data: updatedPatient,
    };
  }

  /**
   * 删除患者
   */
  async deletePatient(id: string) {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`未找到ID为${id}的患者`);
    }

    await this.patientRepository.softDelete(id);

    return {
      code: 200,
      message: '删除患者成功',
    };
  }
}
