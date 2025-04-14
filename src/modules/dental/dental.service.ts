import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { Appointment } from './entities/appointment.entity';
import { MedicalRecord } from './entities/medical-record.entity';
import { Followup } from './entities/followup.entity';
import { Inventory } from './entities/inventory.entity';
import { InventoryInRecord } from './entities/inventory-in-record.entity';
import { InventoryOutRecord } from './entities/inventory-out-record.entity';
import { CreateInventoryDto, UpdateInventoryDto, InventoryQueryDto } from './dto/inventory.dto';
import { CreateInventoryInRecordDto, InventoryInRecordQueryDto } from './dto/inventory-in-record.dto';
import { CreateInventoryOutRecordDto, InventoryOutRecordQueryDto } from './dto/inventory-out-record.dto';

/**
 * 牙科诊所管理系统服务
 * 实现牙科诊所管理系统的业务逻辑
 */
@Injectable()
export class DentalService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,

    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,

    @InjectRepository(MedicalRecord)
    private medicalRecordRepository: Repository<MedicalRecord>,

    @InjectRepository(Followup)
    private followupRepository: Repository<Followup>,

    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,

    @InjectRepository(InventoryInRecord)
    private inventoryInRecordRepository: Repository<InventoryInRecord>,

    @InjectRepository(InventoryOutRecord)
    private inventoryOutRecordRepository: Repository<InventoryOutRecord>,
  ) {}

  /* 患者管理方法 */

  /**
   * 获取患者列表，支持分页、过滤和排序
   */
  async getPatients(query: any) {
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
      success: true,
      message: '获取患者列表成功',
      data: {
        items: patients,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
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
      success: true,
      message: '获取患者详情成功',
      data: patient,
    };
  }

  /**
   * 创建新患者
   */
  async createPatient(patientData: any) {
    const patient = this.patientRepository.create(patientData);
    const savedPatient = await this.patientRepository.save(patient);

    return {
      success: true,
      message: '创建患者成功',
      data: savedPatient,
    };
  }

  /**
   * 更新患者信息
   */
  async updatePatient(id: string, patientData: any) {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`未找到ID为${id}的患者`);
    }

    // 合并数据
    const updatedPatient = { ...patient, ...patientData };
    await this.patientRepository.save(updatedPatient);

    return {
      success: true,
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
      success: true,
      message: '删除患者成功',
    };
  }

  /* 预约管理方法 */

  /**
   * 获取预约列表，支持分页和过滤
   */
  async getAppointments(query: any) {
    const { page = 1, limit = 10, patientId, status } = query;
    const skip = (page - 1) * limit;

    const queryBuilder =
      this.appointmentRepository.createQueryBuilder('appointment');
    queryBuilder.leftJoinAndSelect('appointment.patient', 'patient');

    // 过滤条件
    if (patientId) {
      queryBuilder.andWhere('appointment.patientId = :patientId', {
        patientId,
      });
    }

    if (status) {
      queryBuilder.andWhere('appointment.status = :status', { status });
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页
    queryBuilder.skip(skip).take(limit);

    // 排序 - 默认按预约时间排序
    queryBuilder.orderBy('appointment.appointmentTime', 'ASC');

    // 执行查询
    const appointments = await queryBuilder.getMany();

    return {
      success: true,
      message: '获取预约列表成功',
      data: {
        items: appointments,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 获取特定日期的预约
   */
  async getAppointmentsByDate(date: string) {
    // 构建日期范围查询
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const appointments = await this.appointmentRepository.find({
      where: {
        appointmentTime: Between(startDate, endDate),
      },
      relations: ['patient'],
      order: { appointmentTime: 'ASC' },
    });

    return {
      success: true,
      message: '获取日期预约成功',
      data: appointments,
    };
  }

  /**
   * 创建新预约
   */
  async createAppointment(appointmentData: any) {
    // 检查患者是否存在
    if (appointmentData.patientId) {
      const patient = await this.patientRepository.findOne({
        where: { id: appointmentData.patientId },
      });

      if (!patient) {
        throw new NotFoundException(
          `未找到ID为${appointmentData.patientId}的患者`,
        );
      }
    }

    const appointment = this.appointmentRepository.create(appointmentData);
    const savedAppointment = await this.appointmentRepository.save(appointment);

    return {
      success: true,
      message: '创建预约成功',
      data: savedAppointment,
    };
  }

  /**
   * 更新预约信息
   */
  async updateAppointment(id: string, appointmentData: any) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException(`未找到ID为${id}的预约`);
    }

    // 合并数据
    const updatedAppointment = { ...appointment, ...appointmentData };
    await this.appointmentRepository.save(updatedAppointment);

    return {
      success: true,
      message: '更新预约信息成功',
      data: updatedAppointment,
    };
  }

  /**
   * 删除预约
   */
  async deleteAppointment(id: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException(`未找到ID为${id}的预约`);
    }

    await this.appointmentRepository.softDelete(id);

    return {
      success: true,
      message: '删除预约成功',
    };
  }

  /* 病历记录方法 */

  /**
   * 获取患者病历列表
   */
  async getMedicalRecords(patientId: string, query: any) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // 检查患者是否存在
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException(`未找到ID为${patientId}的患者`);
    }

    const queryBuilder =
      this.medicalRecordRepository.createQueryBuilder('record');
    queryBuilder.where('record.patientId = :patientId', { patientId });

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页
    queryBuilder.skip(skip).take(limit);

    // 排序 - 默认按记录时间倒序
    queryBuilder.orderBy('record.treatmentDate', 'DESC');

    // 执行查询
    const records = await queryBuilder.getMany();

    return {
      success: true,
      message: '获取病历记录成功',
      data: {
        items: records,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 创建患者病历记录
   */
  async createMedicalRecord(patientId: string, recordData: any) {
    // 检查患者是否存在
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException(`未找到ID为${patientId}的患者`);
    }

    const record = this.medicalRecordRepository.create({
      ...recordData,
      patientId,
    });

    const savedRecord = await this.medicalRecordRepository.save(record);

    return {
      success: true,
      message: '创建病历记录成功',
      data: savedRecord,
    };
  }

  /**
   * 更新病历记录
   */
  async updateMedicalRecord(id: string, recordData: any) {
    const record = await this.medicalRecordRepository.findOne({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException(`未找到ID为${id}的病历记录`);
    }

    // 合并数据
    const updatedRecord = { ...record, ...recordData };
    await this.medicalRecordRepository.save(updatedRecord);

    return {
      success: true,
      message: '更新病历记录成功',
      data: updatedRecord,
    };
  }

  /**
   * 删除病历记录
   */
  async deleteMedicalRecord(id: string) {
    const record = await this.medicalRecordRepository.findOne({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException(`未找到ID为${id}的病历记录`);
    }

    await this.medicalRecordRepository.softDelete(id);

    return {
      success: true,
      message: '删除病历记录成功',
    };
  }

  /* 复诊记录方法 */

  /**
   * 获取患者复诊记录列表
   */
  async getFollowups(patientId: string, query: any) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // 检查患者是否存在
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException(`未找到ID为${patientId}的患者`);
    }

    const queryBuilder = this.followupRepository.createQueryBuilder('followup');
    queryBuilder.where('followup.patientId = :patientId', { patientId });

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页
    queryBuilder.skip(skip).take(limit);

    // 排序 - 默认按复诊日期倒序
    queryBuilder.orderBy('followup.followupDate', 'DESC');

    // 执行查询
    const followups = await queryBuilder.getMany();

    return {
      success: true,
      message: '获取复诊记录成功',
      data: {
        items: followups,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 创建患者复诊记录
   */
  async createFollowup(patientId: string, followupData: any) {
    // 检查患者是否存在
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException(`未找到ID为${patientId}的患者`);
    }

    const followup = this.followupRepository.create({
      ...followupData,
      patientId,
    });

    const savedFollowup = await this.followupRepository.save(followup);

    return {
      success: true,
      message: '创建复诊记录成功',
      data: savedFollowup,
    };
  }

  /**
   * 更新复诊记录
   */
  async updateFollowup(id: string, followupData: any) {
    const followup = await this.followupRepository.findOne({ where: { id } });

    if (!followup) {
      throw new NotFoundException(`未找到ID为${id}的复诊记录`);
    }

    // 合并数据
    const updatedFollowup = { ...followup, ...followupData };
    await this.followupRepository.save(updatedFollowup);

    return {
      success: true,
      message: '更新复诊记录成功',
      data: updatedFollowup,
    };
  }

  /**
   * 删除复诊记录
   */
  async deleteFollowup(id: string) {
    const followup = await this.followupRepository.findOne({ where: { id } });

    if (!followup) {
      throw new NotFoundException(`未找到ID为${id}的复诊记录`);
    }

    await this.followupRepository.softDelete(id);

    return {
      success: true,
      message: '删除复诊记录成功',
    };
  }

  // 库存管理方法
  async getInventoryList(query: InventoryQueryDto) {
    try {
      const { page = 1, pageSize = 10, keyword, type, supplier, lowStock } = query;
      const skip = (page - 1) * pageSize;

      const whereConditions: any = {};
      if (keyword) {
        whereConditions.name = Like(`%${keyword}%`);
      }
      if (type) {
        whereConditions.type = type;
      }
      if (supplier) {
        whereConditions.supplier = supplier;
      }
      if (lowStock) {
        whereConditions.currentQuantity = { lessThan: 'safetyQuantity' };
      }

      const [items, total] = await this.inventoryRepository.findAndCount({
        where: whereConditions,
        skip,
        take: pageSize,
        order: { createdAt: 'DESC' },
      });

      return {
        success: true,
        message: '获取库存列表成功',
        data: {
          items,
          meta: {
            page: Number(page),
            pageSize: Number(pageSize),
            total,
            totalPages: Math.ceil(total / pageSize),
          },
        },
      };
    } catch (error) {
      console.error('获取库存列表出错:', error);
      // 检查是否为表不存在错误
      if (error.message && (
          error.message.includes('dental_inventory') || 
          error.message.includes('表不存在') || 
          error.message.includes('doesn\'t exist'))) {
        return {
          success: false,
          message: '库存表正在初始化中，请稍后再试',
          data: {
            items: [],
            meta: {
              page: 1,
              pageSize: 10,
              total: 0,
              totalPages: 0,
            },
          },
        };
      }
      throw error;
    }
  }

  async getInventory(id: string) {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['inRecords', 'outRecords'],
    });

    if (!inventory) {
      throw new NotFoundException(`未找到ID为${id}的库存项`);
    }

    return {
      success: true,
      message: '获取库存项成功',
      data: inventory,
    };
  }

  async createInventory(inventoryData: CreateInventoryDto) {
    const inventory = this.inventoryRepository.create(inventoryData);
    const savedInventory = await this.inventoryRepository.save(inventory);

    return {
      success: true,
      message: '创建库存项成功',
      data: savedInventory,
    };
  }

  async updateInventory(id: string, inventoryData: UpdateInventoryDto) {
    const inventory = await this.inventoryRepository.findOneBy({ id });
    if (!inventory) {
      throw new NotFoundException(`未找到ID为${id}的库存项`);
    }

    await this.inventoryRepository.update(id, inventoryData);
    const updatedInventory = await this.inventoryRepository.findOneBy({ id });

    return {
      success: true,
      message: '更新库存项成功',
      data: updatedInventory,
    };
  }

  async deleteInventory(id: string) {
    const inventory = await this.inventoryRepository.findOneBy({ id });
    if (!inventory) {
      throw new NotFoundException(`未找到ID为${id}的库存项`);
    }

    // 软删除库存项
    await this.inventoryRepository.softDelete(id);

    return {
      success: true,
      message: '删除库存项成功',
      data: null,
    };
  }

  // 入库记录管理
  async getInventoryInRecords(query: InventoryInRecordQueryDto) {
    const { page = 1, pageSize = 10, inventoryId, startDate, endDate } = query;
    const skip = (page - 1) * pageSize;

    const whereConditions: any = {};
    if (inventoryId) {
      whereConditions.inventoryId = inventoryId;
    }
    if (startDate && endDate) {
      whereConditions.createdAt = Between(new Date(startDate), new Date(endDate));
    }

    const [items, total] = await this.inventoryInRecordRepository.findAndCount({
      where: whereConditions,
      relations: ['inventory'],
      skip,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      message: '获取入库记录列表成功',
      data: {
        items,
        meta: {
          page: Number(page),
          pageSize: Number(pageSize),
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    };
  }

  async createInventoryInRecord(recordData: CreateInventoryInRecordDto) {
    try {
      const { inventoryId, quantity, unitPrice, ...rest } = recordData;
      
      // 查找库存项
      const inventory = await this.inventoryRepository.findOneBy({ id: inventoryId });
      if (!inventory) {
        throw new NotFoundException(`未找到ID为${inventoryId}的库存项`);
      }

      // 创建入库记录
      const inRecord = this.inventoryInRecordRepository.create({
        inventoryId,
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice,
        ...rest,
      });
      const savedRecord = await this.inventoryInRecordRepository.save(inRecord);

      // 更新库存数量
      await this.inventoryRepository.update(inventoryId, {
        currentQuantity: inventory.currentQuantity + quantity,
      });

      return {
        success: true,
        message: '创建入库记录成功',
        data: savedRecord,
      };
    } catch (error) {
      console.error('创建入库记录出错:', error);
      // 检查是否为表不存在错误
      if (error.message && (
          error.message.includes('dental_inventory_in_record') || 
          error.message.includes('表不存在') || 
          error.message.includes('doesn\'t exist'))) {
        return {
          success: false,
          message: '入库记录表正在初始化中，请稍后再试',
          data: null,
        };
      }
      throw error;
    }
  }

  async getInventoryInRecord(id: string) {
    const record = await this.inventoryInRecordRepository.findOne({
      where: { id },
      relations: ['inventory'],
    });

    if (!record) {
      throw new NotFoundException(`未找到ID为${id}的入库记录`);
    }

    return {
      success: true,
      message: '获取入库记录成功',
      data: record,
    };
  }

  async deleteInventoryInRecord(id: string) {
    const record = await this.inventoryInRecordRepository.findOne({
      where: { id },
      relations: ['inventory'],
    });

    if (!record) {
      throw new NotFoundException(`未找到ID为${id}的入库记录`);
    }

    const inventoryId = record.inventoryId;
    const inventory = await this.inventoryRepository.findOneBy({ id: inventoryId });

    // 软删除入库记录
    await this.inventoryInRecordRepository.softDelete(id);

    // 更新库存数量（如果库存充足）
    if (inventory && inventory.currentQuantity >= record.quantity) {
      await this.inventoryRepository.update(inventoryId, {
        currentQuantity: inventory.currentQuantity - record.quantity,
      });
    }

    return {
      success: true,
      message: '删除入库记录成功',
      data: null,
    };
  }

  // 出库记录管理
  async getInventoryOutRecords(query: InventoryOutRecordQueryDto) {
    const { page = 1, pageSize = 10, inventoryId, type, startDate, endDate } = query;
    const skip = (page - 1) * pageSize;

    const whereConditions: any = {};
    if (inventoryId) {
      whereConditions.inventoryId = inventoryId;
    }
    if (type) {
      whereConditions.type = type;
    }
    if (startDate && endDate) {
      whereConditions.createdAt = Between(new Date(startDate), new Date(endDate));
    }

    const [items, total] = await this.inventoryOutRecordRepository.findAndCount({
      where: whereConditions,
      relations: ['inventory'],
      skip,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      message: '获取出库记录列表成功',
      data: {
        items,
        meta: {
          page: Number(page),
          pageSize: Number(pageSize),
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    };
  }

  async createInventoryOutRecord(recordData: CreateInventoryOutRecordDto) {
    try {
      const { inventoryId, quantity, ...rest } = recordData;
      
      // 查找库存项
      const inventory = await this.inventoryRepository.findOneBy({ id: inventoryId });
      if (!inventory) {
        throw new NotFoundException(`未找到ID为${inventoryId}的库存项`);
      }

      // 检查库存是否充足
      if (inventory.currentQuantity < quantity) {
        throw new BadRequestException(`库存不足，当前库存: ${inventory.currentQuantity}, 需要: ${quantity}`);
      }

      // 创建出库记录
      const outRecord = this.inventoryOutRecordRepository.create({
        inventoryId,
        quantity,
        ...rest,
      });
      const savedRecord = await this.inventoryOutRecordRepository.save(outRecord);

      // 更新库存数量
      await this.inventoryRepository.update(inventoryId, {
        currentQuantity: inventory.currentQuantity - quantity,
      });

      return {
        success: true,
        message: '创建出库记录成功',
        data: savedRecord,
      };
    } catch (error) {
      console.error('创建出库记录出错:', error);
      // 检查是否为表不存在错误
      if (error.message && (
          error.message.includes('dental_inventory_out_record') || 
          error.message.includes('表不存在') || 
          error.message.includes('doesn\'t exist'))) {
        return {
          success: false,
          message: '出库记录表正在初始化中，请稍后再试',
          data: null,
        };
      }
      throw error;
    }
  }

  async getInventoryOutRecord(id: string) {
    const record = await this.inventoryOutRecordRepository.findOne({
      where: { id },
      relations: ['inventory'],
    });

    if (!record) {
      throw new NotFoundException(`未找到ID为${id}的出库记录`);
    }

    return {
      success: true,
      message: '获取出库记录成功',
      data: record,
    };
  }

  async deleteInventoryOutRecord(id: string) {
    const record = await this.inventoryOutRecordRepository.findOne({
      where: { id },
      relations: ['inventory'],
    });

    if (!record) {
      throw new NotFoundException(`未找到ID为${id}的出库记录`);
    }

    const inventoryId = record.inventoryId;
    const inventory = await this.inventoryRepository.findOneBy({ id: inventoryId });

    // 软删除出库记录
    await this.inventoryOutRecordRepository.softDelete(id);

    // 恢复库存数量
    if (inventory) {
      await this.inventoryRepository.update(inventoryId, {
        currentQuantity: inventory.currentQuantity + record.quantity,
      });
    }

    return {
      success: true,
      message: '删除出库记录成功',
      data: null,
    };
  }
  
  // 库存统计
  async getInventoryStatistics() {
    try {
      console.log('Starting inventory statistics calculation...');
      
      // Total inventory count
      const totalCount = await this.inventoryRepository.count();
      console.log(`Total inventory count: ${totalCount}`);
      
      // Warning count (below safety quantity)
      const warningQuery = this.inventoryRepository.createQueryBuilder('inventory')
        .where('inventory.current_quantity < inventory.safety_quantity')
        .andWhere('inventory.current_quantity > 0');
      
      console.log('Warning query SQL:', warningQuery.getSql());
      const warningCount = await warningQuery.getCount();
      console.log(`Warning count: ${warningCount}`);
      
      // Empty count
      const emptyQuery = this.inventoryRepository.createQueryBuilder('inventory')
        .where('inventory.current_quantity = 0');
      
      console.log('Empty query SQL:', emptyQuery.getSql());
      const emptyCount = await emptyQuery.getCount();
      console.log(`Empty count: ${emptyCount}`);
      
      // Type statistics
      const typeStats = await this.inventoryRepository.createQueryBuilder('inventory')
        .select('inventory.type', 'type')
        .addSelect('COUNT(*)', 'count')
        .groupBy('inventory.type')
        .getRawMany();
      
      console.log('Type statistics:', typeStats);
      
      return {
        success: true,
        message: '获取库存统计信息成功',
        data: {
          totalCount,
          warningCount,
          emptyCount,
          typeStats: typeStats.map(stat => ({
            type: stat.type,
            count: parseInt(stat.count)
          }))
        }
      };
    } catch (error) {
      console.error('Error in getInventoryStatistics:', error);
      // 检查是否为表不存在错误
      if (error.message && (
          error.message.includes('dental_inventory') || 
          error.message.includes('表不存在') || 
          error.message.includes('doesn\'t exist'))) {
        return {
          success: false,
          message: '库存表正在初始化中，请稍后再试',
          data: {
            totalCount: 0,
            warningCount: 0,
            emptyCount: 0,
            typeStats: []
          }
        };
      }
      return {
        success: false,
        message: `获取库存统计信息失败: ${error.message}`,
        error: error.stack
      };
    }
  }
}
