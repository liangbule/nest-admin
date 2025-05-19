import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Appointment } from './appointment/entities/appointment.entity';
import { MedicalRecord } from './entities/medical-record.entity';
import { Followup } from './entities/followup.entity';
import { Inventory } from './inventory/entities/inventory.entity';
import { InventoryInRecord } from './inventory/entities/inventory-in-record.entity';
import { InventoryOutRecord } from './inventory/entities/inventory-out-record.entity';
import { StockTake } from './inventory/entities/stock-take.entity';
import { StockTakeItem } from './inventory/entities/stock-take-item.entity';
import {
  CreateInventoryDto,
  UpdateInventoryDto,
  InventoryQueryDto,
  BatchImportInventoryDto,
  LowInventoryQueryDto,
} from './inventory/dto/inventory.dto';
import {
  CreateInventoryInRecordDto,
  InventoryInRecordQueryDto,
} from './inventory/dto/inventory-in-record.dto';
import {
  CreateInventoryOutRecordDto,
  InventoryOutRecordQueryDto,
} from './inventory/dto/inventory-out-record.dto';
import { CreateStockTakeDto, StockTakeQueryDto } from './inventory/dto/stock-take.dto';
import { PatientService } from './patient/patient.service';

/**
 * 牙科诊所管理系统服务
 * 实现牙科诊所管理系统的业务逻辑
 */
@Injectable()
export class DentalService {
  constructor(
    private patientService: PatientService,

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

    @InjectRepository(StockTake)
    private stockTakeRepository: Repository<StockTake>,

    @InjectRepository(StockTakeItem)
    private stockTakeItemRepository: Repository<StockTakeItem>,
  ) {}

  /* 患者管理方法 */

  /**
   * 获取患者列表，支持分页、过滤和排序
   */
  async getPatients(query: any) {
    return this.patientService.getPatients(query);
  }

  /**
   * 获取单个患者的详细信息
   */
  async getPatient(id: string) {
    return this.patientService.getPatient(id);
  }

  /**
   * 创建新患者
   */
  async createPatient(patientData: any) {
    return this.patientService.createPatient(patientData);
  }

  /**
   * 更新患者信息
   */
  async updatePatient(id: string, patientData: any) {
    return this.patientService.updatePatient(id, patientData);
  }

  /**
   * 删除患者
   */
  async deletePatient(id: string) {
    return this.patientService.deletePatient(id);
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
      const patient = await this.patientService.getPatient(appointmentData.patientId);

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
    const patient = await this.patientService.getPatient(patientId);
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
    const patient = await this.patientService.getPatient(patientId);
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
    const patient = await this.patientService.getPatient(patientId);
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
    const patient = await this.patientService.getPatient(patientId);
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
      const {
        page = 1,
        pageSize = 10,
        keyword,
        type,
        supplier,
        lowStock,
      } = query;
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
      if (
        error.message &&
        (error.message.includes('dental_inventory') ||
          error.message.includes('表不存在') ||
          error.message.includes("doesn't exist"))
      ) {
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

  async batchImportInventory(batchData: BatchImportInventoryDto) {
    try {
      // 确保有库存项
      if (!batchData.items || batchData.items.length === 0) {
        return {
          code: 400,
          message: '没有可导入的库存项',
          data: null,
        };
      }

      const results = {
        total: batchData.items.length,
        success: 0,
        failed: 0,
        items: [],
      };

      // 逐个处理每个库存项
      for (const item of batchData.items) {
        try {
          // 检查是否已存在相同编码的库存项
          const existingItem = await this.inventoryRepository.findOne({
            where: { code: item.code },
          });

          if (existingItem) {
            // 如果存在，更新库存项
            await this.inventoryRepository.update(existingItem.id, item);
            results.success++;
            results.items.push({
              code: item.code,
              name: item.name,
              status: 'updated',
              message: '更新成功',
            });
          } else {
            // 如果不存在，创建新库存项
            const inventory = this.inventoryRepository.create(item);
            await this.inventoryRepository.save(inventory);
            results.success++;
            results.items.push({
              code: item.code,
              name: item.name,
              status: 'created',
              message: '创建成功',
            });
          }
        } catch (error) {
          results.failed++;
          results.items.push({
            code: item.code,
            name: item.name,
            status: 'failed',
            message: error.message || '处理失败',
          });
        }
      }

      return {
        code: 200,
        message: `批量导入完成，成功: ${results.success}, 失败: ${results.failed}`,
        data: results,
      };
    } catch (error) {
      console.error('批量导入库存出错:', error);
      throw error;
    }
  }

  async getLowInventoryList(query: LowInventoryQueryDto) {
    try {
      const {
        page = 1,
        pageSize = 10,
        keyword,
        type,
        onlyLow = true,
        onlyEmpty = false,
        belowSafety = true,
      } = query;
      const skip = (page - 1) * pageSize;

      // 构建查询条件
      const queryBuilder =
        this.inventoryRepository.createQueryBuilder('inventory');

      // 添加筛选条件
      if (keyword) {
        queryBuilder.andWhere(
          '(inventory.name LIKE :keyword OR inventory.code LIKE :keyword)',
          { keyword: `%${keyword}%` },
        );
      }

      if (type) {
        queryBuilder.andWhere('inventory.type = :type', { type });
      }

      // 低库存条件
      if (onlyLow) {
        if (onlyEmpty) {
          // 仅显示库存为零的物品
          queryBuilder.andWhere('inventory.current_quantity = 0');
        } else if (belowSafety) {
          // 显示低于安全库存的物品
          queryBuilder.andWhere(
            'inventory.current_quantity < inventory.safety_quantity',
          );
        } else {
          // 默认显示所有低库存的物品（安全库存或零库存）
          queryBuilder.andWhere(
            '(inventory.current_quantity < inventory.safety_quantity OR inventory.current_quantity = 0)',
          );
        }
      }

      // 分页和排序
      const total = await queryBuilder.getCount();

      queryBuilder
        .orderBy('inventory.current_quantity', 'ASC') // 库存从低到高排序
        .skip(skip)
        .take(pageSize);

      const items = await queryBuilder.getMany();

      return {
        code: 200,
        message: '获取低库存预警列表成功',
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
      console.error('获取低库存预警列表出错:', error);
      throw error;
    }
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
      whereConditions.createdAt = Between(
        new Date(startDate),
        new Date(endDate),
      );
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
      const inventory = await this.inventoryRepository.findOneBy({
        id: inventoryId,
      });
      if (!inventory) {
        throw new NotFoundException(`未找到ID为${inventoryId}的库存项`);
      }

      // 创建入库记录
      const inRecord = this.inventoryInRecordRepository.create({
        inventoryId,
        quantity,
        unitPrice: unitPrice ? parseFloat(unitPrice) : null,
        totalPrice: unitPrice ? quantity * parseFloat(unitPrice) : null,
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
      if (
        error.message &&
        (error.message.includes('dental_inventory_in_record') ||
          error.message.includes('表不存在') ||
          error.message.includes("doesn't exist"))
      ) {
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
    const inventory = await this.inventoryRepository.findOneBy({
      id: inventoryId,
    });

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
    const {
      page = 1,
      pageSize = 10,
      inventoryId,
      type,
      startDate,
      endDate,
    } = query;
    const skip = (page - 1) * pageSize;

    const whereConditions: any = {};
    if (inventoryId) {
      whereConditions.inventoryId = inventoryId;
    }
    if (type) {
      whereConditions.type = type;
    }
    if (startDate && endDate) {
      whereConditions.createdAt = Between(
        new Date(startDate),
        new Date(endDate),
      );
    }

    const [items, total] = await this.inventoryOutRecordRepository.findAndCount(
      {
        where: whereConditions,
        relations: ['inventory'],
        skip,
        take: pageSize,
        order: { createdAt: 'DESC' },
      },
    );

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
      const inventory = await this.inventoryRepository.findOneBy({
        id: inventoryId,
      });
      if (!inventory) {
        throw new NotFoundException(`未找到ID为${inventoryId}的库存项`);
      }

      // 检查库存是否充足
      if (inventory.currentQuantity < quantity) {
        throw new BadRequestException(
          `库存不足，当前库存: ${inventory.currentQuantity}, 需要: ${quantity}`,
        );
      }

      // 创建出库记录
      const outRecord = this.inventoryOutRecordRepository.create({
        inventoryId,
        quantity,
        ...rest,
      });
      const savedRecord = await this.inventoryOutRecordRepository.save(
        outRecord,
      );

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
      if (
        error.message &&
        (error.message.includes('dental_inventory_out_record') ||
          error.message.includes('表不存在') ||
          error.message.includes("doesn't exist"))
      ) {
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
    const inventory = await this.inventoryRepository.findOneBy({
      id: inventoryId,
    });

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
      const warningQuery = this.inventoryRepository
        .createQueryBuilder('inventory')
        .where('inventory.current_quantity < inventory.safety_quantity')
        .andWhere('inventory.current_quantity > 0');

      console.log('Warning query SQL:', warningQuery.getSql());
      const warningCount = await warningQuery.getCount();
      console.log(`Warning count: ${warningCount}`);

      // Empty count
      const emptyQuery = this.inventoryRepository
        .createQueryBuilder('inventory')
        .where('inventory.current_quantity = 0');

      console.log('Empty query SQL:', emptyQuery.getSql());
      const emptyCount = await emptyQuery.getCount();
      console.log(`Empty count: ${emptyCount}`);

      // Type statistics
      const typeStats = await this.inventoryRepository
        .createQueryBuilder('inventory')
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
          typeStats: typeStats.map((stat) => ({
            type: stat.type,
            count: parseInt(stat.count),
          })),
        },
      };
    } catch (error) {
      console.error('Error in getInventoryStatistics:', error);
      // 检查是否为表不存在错误
      if (
        error.message &&
        (error.message.includes('dental_inventory') ||
          error.message.includes('表不存在') ||
          error.message.includes("doesn't exist"))
      ) {
        return {
          success: false,
          message: '库存表正在初始化中，请稍后再试',
          data: {
            totalCount: 0,
            warningCount: 0,
            emptyCount: 0,
            typeStats: [],
          },
        };
      }
      return {
        success: false,
        message: `获取库存统计信息失败: ${error.message}`,
        error: error.stack,
      };
    }
  }

  // 库存盘点管理
  async getStockTakeList(query: StockTakeQueryDto) {
    try {
      const {
        page = 1,
        pageSize = 10,
        startDate,
        endDate,
        operator,
        batchNumber,
      } = query;
      const skip = (page - 1) * pageSize;

      const whereConditions: any = {};
      if (operator) {
        whereConditions.operator = operator;
      }
      if (batchNumber) {
        whereConditions.batchNumber = Like(`%${batchNumber}%`);
      }
      if (startDate && endDate) {
        whereConditions.stockTakeDate = Between(
          new Date(startDate),
          new Date(endDate),
        );
      }

      const [items, total] = await this.stockTakeRepository.findAndCount({
        where: whereConditions,
        skip,
        take: pageSize,
        order: { createdAt: 'DESC' },
        relations: ['items', 'items.inventory'],
      });

      return {
        code: 200,
        message: '获取盘点记录列表成功',
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
      console.error('获取盘点记录列表出错:', error);
      // 检查是否为表不存在错误
      if (
        error.message &&
        (error.message.includes('dental_stock_take') ||
          error.message.includes('表不存在') ||
          error.message.includes("doesn't exist"))
      ) {
        return {
          code: 200,
          message: '盘点表正在初始化中，请稍后再试',
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

  async getStockTake(id: string) {
    const stockTake = await this.stockTakeRepository.findOne({
      where: { id },
      relations: ['items', 'items.inventory'],
    });

    if (!stockTake) {
      throw new NotFoundException(`未找到ID为${id}的盘点记录`);
    }

    return {
      code: 200,
      message: '获取盘点记录成功',
      data: stockTake,
    };
  }

  async createStockTake(stockTakeData: CreateStockTakeDto) {
    try {
      // 1. 创建盘点主记录
      const stockTake = this.stockTakeRepository.create({
        batchNumber: stockTakeData.batchNumber || `ST-${new Date().getTime()}`,
        stockTakeDate: stockTakeData.stockTakeDate
          ? new Date(stockTakeData.stockTakeDate)
          : new Date(),
        operator: stockTakeData.operator,
        remarks: stockTakeData.remarks,
      });

      const savedStockTake = await this.stockTakeRepository.save(stockTake);

      // 2. 处理盘点项
      const stockTakeItems = [];
      let totalItems = 0;
      let matchItems = 0;
      let differencesItems = 0;

      for (const item of stockTakeData.items) {
        // 获取当前库存数量
        const inventory = await this.inventoryRepository.findOne({
          where: { id: item.inventoryId },
        });

        if (!inventory) {
          throw new NotFoundException(`未找到ID为${item.inventoryId}的库存项`);
        }

        const systemQuantity = inventory.currentQuantity;
        const actualQuantity = item.actualQuantity;
        const difference = actualQuantity - systemQuantity;

        // 创建盘点项记录
        const stockTakeItem = this.stockTakeItemRepository.create({
          stockTakeId: savedStockTake.id,
          inventoryId: item.inventoryId,
          systemQuantity,
          actualQuantity,
          difference,
          reason: item.reason || (difference !== 0 ? '盘点差异' : '数量一致'),
        });

        await this.stockTakeItemRepository.save(stockTakeItem);
        stockTakeItems.push(stockTakeItem);

        // 如果盘点数量与系统数量不一致，则更新库存数量
        if (difference !== 0) {
          await this.inventoryRepository.update(item.inventoryId, {
            currentQuantity: actualQuantity,
          });
          differencesItems++;
        } else {
          matchItems++;
        }

        totalItems++;
      }

      // 3. 更新盘点主记录的结果摘要
      const resultSummary = `共盘点${totalItems}项商品，一致${matchItems}项，差异${differencesItems}项`;
      await this.stockTakeRepository.update(savedStockTake.id, {
        resultSummary,
      });

      savedStockTake.resultSummary = resultSummary;
      savedStockTake.items = stockTakeItems;

      return {
        code: 200,
        message: '创建盘点记录成功',
        data: savedStockTake,
      };
    } catch (error) {
      console.error('创建盘点记录出错:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`创建盘点记录失败: ${error.message}`);
    }
  }

  async deleteStockTake(id: string) {
    const stockTake = await this.stockTakeRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!stockTake) {
      throw new NotFoundException(`未找到ID为${id}的盘点记录`);
    }

    // 先删除关联的盘点项
    if (stockTake.items && stockTake.items.length > 0) {
      await this.stockTakeItemRepository.softDelete(
        stockTake.items.map((item) => item.id),
      );
    }

    // 再删除盘点主记录
    await this.stockTakeRepository.softDelete(id);

    return {
      code: 200,
      message: '删除盘点记录成功',
      data: null,
    };
  }
}
