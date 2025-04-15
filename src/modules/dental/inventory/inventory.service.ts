import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { InventoryInRecord } from './entities/inventory-in-record.entity';
import { InventoryOutRecord } from './entities/inventory-out-record.entity';
import { StockTake } from './entities/stock-take.entity';
import { StockTakeItem } from './entities/stock-take-item.entity';
import { 
  CreateInventoryDto, 
  UpdateInventoryDto, 
  InventoryQueryDto, 
  BatchImportInventoryDto,
  LowInventoryQueryDto 
} from './dto/inventory.dto';
import { CreateInventoryInRecordDto, InventoryInRecordQueryDto } from './dto/inventory-in-record.dto';
import { CreateInventoryOutRecordDto, InventoryOutRecordQueryDto } from './dto/inventory-out-record.dto';
import { CreateStockTakeDto, StockTakeQueryDto } from './dto/stock-take.dto';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,

    @InjectRepository(InventoryInRecord)
    private inventoryInRecordRepository: Repository<InventoryInRecord>,

    @InjectRepository(InventoryOutRecord)
    private inventoryOutRecordRepository: Repository<InventoryOutRecord>,
    
    @InjectRepository(StockTake)
    private stockTakeRepository: Repository<StockTake>,
    
    @InjectRepository(StockTakeItem)
    private stockTakeItemRepository: Repository<StockTakeItem>
  ) {}

  /**
   * 获取库存列表
   */
  async getInventoryList(query: InventoryQueryDto) {
    const { page = 1, pageSize = 10, keyword, type, lowStock } = query;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.inventoryRepository.createQueryBuilder('inventory');

    // 搜索条件
    if (keyword) {
      queryBuilder.where(
        '(inventory.name LIKE :keyword OR inventory.code LIKE :keyword OR inventory.specification LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    // 按类型筛选
    if (type) {
      queryBuilder.andWhere('inventory.type = :type', { type });
    }

    // 库存预警筛选
    if (lowStock) {
      queryBuilder.andWhere('inventory.currentQuantity <= inventory.safetyQuantity');
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页
    queryBuilder.skip(skip).take(pageSize);

    // 排序
    queryBuilder.orderBy('inventory.createdAt', 'DESC');

    // 执行查询
    const items = await queryBuilder.getMany();

    return {
      code: 200,
      message: '获取库存列表成功',
      data: {
        items,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
      },
    };
  }

  /**
   * 获取低库存预警列表
   */
  async getLowInventoryList(query: LowInventoryQueryDto) {
    const { page = 1, pageSize = 10, onlyLow, onlyEmpty, belowSafety } = query;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.inventoryRepository.createQueryBuilder('inventory');
    
    // 根据查询参数构建过滤条件
    if (onlyEmpty) {
      queryBuilder.where('inventory.currentQuantity = 0');
    } else if (belowSafety) {
      queryBuilder.where('inventory.currentQuantity <= inventory.safetyQuantity');
    } else if (onlyLow) {
      queryBuilder.where('inventory.currentQuantity < 5');
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页
    queryBuilder.skip(skip).take(pageSize);

    // 排序 - 优先显示库存更少的
    queryBuilder.orderBy('inventory.currentQuantity', 'ASC');

    // 执行查询
    const items = await queryBuilder.getMany();

    return {
      code: 200,
      message: '获取低库存预警列表成功',
      data: {
        items,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
      },
    };
  }

  /**
   * 获取库存详情
   */
  async getInventory(id: string) {
    const inventory = await this.inventoryRepository.findOne({ where: { id } });
    if (!inventory) {
      throw new NotFoundException(`未找到ID为${id}的库存项`);
    }

    return {
      code: 200,
      message: '获取库存详情成功',
      data: inventory,
    };
  }

  /**
   * 创建库存项
   */
  async createInventory(createInventoryDto: CreateInventoryDto) {
    // 检查编码是否已存在
    const existingInventory = await this.inventoryRepository.findOne({
      where: { code: createInventoryDto.code },
    });

    if (existingInventory) {
      throw new BadRequestException(`编码为${createInventoryDto.code}的库存项已存在`);
    }

    const inventory = this.inventoryRepository.create(createInventoryDto);
    const savedInventory = await this.inventoryRepository.save(inventory);

    return {
      code: 200,
      message: '创建库存项成功',
      data: savedInventory,
    };
  }

  /**
   * 批量导入库存
   */
  async batchImportInventory(batchImportDto: BatchImportInventoryDto) {
    const { items } = batchImportDto;
    const result = {
      success: [],
      fail: [],
    };

    for (const item of items) {
      try {
        // 检查编码是否已存在
        const existingInventory = await this.inventoryRepository.findOne({
          where: { code: item.code },
        });

        if (existingInventory) {
          result.fail.push({
            code: item.code,
            name: item.name,
            reason: '编码已存在',
          });
          continue;
        }

        const inventory = this.inventoryRepository.create(item);
        const savedInventory = await this.inventoryRepository.save(inventory);
        
        result.success.push({
          id: savedInventory.id,
          code: savedInventory.code,
          name: savedInventory.name,
        });
      } catch (error) {
        this.logger.error(`批量导入库存项失败: ${error.message}`, error.stack);
        result.fail.push({
          code: item.code,
          name: item.name,
          reason: error.message || '未知错误',
        });
      }
    }

    return {
      code: 200,
      message: '批量导入库存完成',
      data: {
        total: items.length,
        successCount: result.success.length,
        failCount: result.fail.length,
        details: result,
      },
    };
  }

  /**
   * 更新库存项
   */
  async updateInventory(id: string, updateInventoryDto: UpdateInventoryDto) {
    const inventory = await this.inventoryRepository.findOne({ where: { id } });
    if (!inventory) {
      throw new NotFoundException(`未找到ID为${id}的库存项`);
    }

    // 如果更新了编码，检查新编码是否已存在
    if (updateInventoryDto.code && updateInventoryDto.code !== inventory.code) {
      const existingInventory = await this.inventoryRepository.findOne({
        where: { code: updateInventoryDto.code },
      });

      if (existingInventory) {
        throw new BadRequestException(`编码为${updateInventoryDto.code}的库存项已存在`);
      }
    }

    const updatedInventory = { ...inventory, ...updateInventoryDto };
    await this.inventoryRepository.save(updatedInventory);

    return {
      code: 200,
      message: '更新库存项成功',
      data: updatedInventory,
    };
  }

  /**
   * 删除库存项
   */
  async deleteInventory(id: string) {
    const inventory = await this.inventoryRepository.findOne({ where: { id } });
    if (!inventory) {
      throw new NotFoundException(`未找到ID为${id}的库存项`);
    }

    // 检查是否有关联的入库记录和出库记录
    const inRecordsCount = await this.inventoryInRecordRepository.count({
      where: { inventoryId: id },
    });

    const outRecordsCount = await this.inventoryOutRecordRepository.count({
      where: { inventoryId: id },
    });

    if (inRecordsCount > 0 || outRecordsCount > 0) {
      throw new BadRequestException('该库存项有关联的入库或出库记录，无法删除');
    }

    await this.inventoryRepository.softDelete(id);

    return {
      code: 200,
      message: '删除库存项成功',
    };
  }

  /**
   * 获取入库记录列表
   */
  async getInventoryInRecords(query: InventoryInRecordQueryDto) {
    const { page = 1, pageSize = 10, inventoryId, startDate, endDate, type } = query;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.inventoryInRecordRepository.createQueryBuilder('record');
    queryBuilder.leftJoinAndSelect('record.inventory', 'inventory');

    // 按库存ID筛选
    if (inventoryId) {
      queryBuilder.andWhere('record.inventoryId = :inventoryId', { inventoryId });
    }

    // 按日期范围筛选
    if (startDate && endDate) {
      queryBuilder.andWhere('record.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    } else if (startDate) {
      queryBuilder.andWhere('record.createdAt >= :startDate', {
        startDate: new Date(startDate),
      });
    } else if (endDate) {
      queryBuilder.andWhere('record.createdAt <= :endDate', {
        endDate: new Date(endDate),
      });
    }

    // 按类型筛选
    if (type) {
      queryBuilder.andWhere('record.type = :type', { type });
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页
    queryBuilder.skip(skip).take(pageSize);

    // 排序
    queryBuilder.orderBy('record.createdAt', 'DESC');

    // 执行查询
    const items = await queryBuilder.getMany();

    return {
      code: 200,
      message: '获取入库记录列表成功',
      data: {
        items,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
      },
    };
  }

  /**
   * 获取入库记录详情
   */
  async getInventoryInRecord(id: string) {
    const record = await this.inventoryInRecordRepository.findOne({
      where: { id },
      relations: ['inventory'],
    });

    if (!record) {
      throw new NotFoundException(`未找到ID为${id}的入库记录`);
    }

    return {
      code: 200,
      message: '获取入库记录详情成功',
      data: record,
    };
  }

  /**
   * 创建入库记录
   */
  async createInventoryInRecord(dto: CreateInventoryInRecordDto) {
    // 检查库存项是否存在
    const inventory = await this.inventoryRepository.findOne({
      where: { id: dto.inventoryId },
    });

    if (!inventory) {
      throw new NotFoundException(`未找到ID为${dto.inventoryId}的库存项`);
    }

    // 创建入库记录，需要从DTO转换为实体
    const inRecord = new InventoryInRecord();
    inRecord.inventoryId = dto.inventoryId;
    inRecord.quantity = dto.quantity;
    inRecord.type = dto.type;
    inRecord.supplier = dto.supplier;
    inRecord.batchNumber = dto.batchNumber;
    inRecord.productionDate = dto.productionDate ? new Date(dto.productionDate) : null;
    inRecord.expirationDate = dto.expirationDate ? new Date(dto.expirationDate) : null;
    inRecord.unitPrice = dto.unitPrice ? parseFloat(dto.unitPrice) : null;
    inRecord.totalPrice = dto.unitPrice && dto.quantity ? parseFloat(dto.unitPrice) * dto.quantity : null;
    inRecord.operator = dto.operator;
    inRecord.remarks = dto.remarks;

    const savedInRecord = await this.inventoryInRecordRepository.save(inRecord);

    // 更新库存数量
    inventory.currentQuantity += dto.quantity;
    await this.inventoryRepository.save(inventory);

    return {
      code: 200,
      message: '创建入库记录成功',
      data: savedInRecord,
    };
  }

  /**
   * 删除入库记录
   */
  async deleteInventoryInRecord(id: string) {
    const record = await this.inventoryInRecordRepository.findOne({
      where: { id },
      relations: ['inventory'],
    });

    if (!record) {
      throw new NotFoundException(`未找到ID为${id}的入库记录`);
    }

    // 恢复库存数量
    const inventory = record.inventory;
    inventory.currentQuantity -= record.quantity;
    
    // 防止库存为负数
    if (inventory.currentQuantity < 0) {
      inventory.currentQuantity = 0;
    }
    
    await this.inventoryRepository.save(inventory);
    await this.inventoryInRecordRepository.softDelete(id);

    return {
      code: 200,
      message: '删除入库记录成功',
    };
  }

  /**
   * 获取出库记录列表
   */
  async getInventoryOutRecords(query: InventoryOutRecordQueryDto) {
    const { page = 1, pageSize = 10, inventoryId, startDate, endDate, type } = query;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.inventoryOutRecordRepository.createQueryBuilder('record');
    queryBuilder.leftJoinAndSelect('record.inventory', 'inventory');

    // 按库存ID筛选
    if (inventoryId) {
      queryBuilder.andWhere('record.inventoryId = :inventoryId', { inventoryId });
    }

    // 按日期范围筛选
    if (startDate && endDate) {
      queryBuilder.andWhere('record.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    } else if (startDate) {
      queryBuilder.andWhere('record.createdAt >= :startDate', {
        startDate: new Date(startDate),
      });
    } else if (endDate) {
      queryBuilder.andWhere('record.createdAt <= :endDate', {
        endDate: new Date(endDate),
      });
    }

    // 按类型筛选
    if (type) {
      queryBuilder.andWhere('record.type = :type', { type });
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页
    queryBuilder.skip(skip).take(pageSize);

    // 排序
    queryBuilder.orderBy('record.createdAt', 'DESC');

    // 执行查询
    const items = await queryBuilder.getMany();

    return {
      code: 200,
      message: '获取出库记录列表成功',
      data: {
        items,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
      },
    };
  }

  /**
   * 获取出库记录详情
   */
  async getInventoryOutRecord(id: string) {
    const record = await this.inventoryOutRecordRepository.findOne({
      where: { id },
      relations: ['inventory'],
    });

    if (!record) {
      throw new NotFoundException(`未找到ID为${id}的出库记录`);
    }

    return {
      code: 200,
      message: '获取出库记录详情成功',
      data: record,
    };
  }

  /**
   * 创建出库记录
   */
  async createInventoryOutRecord(dto: CreateInventoryOutRecordDto) {
    // 检查库存项是否存在
    const inventory = await this.inventoryRepository.findOne({
      where: { id: dto.inventoryId },
    });

    if (!inventory) {
      throw new NotFoundException(`未找到ID为${dto.inventoryId}的库存项`);
    }

    // 检查库存是否足够
    if (inventory.currentQuantity < dto.quantity) {
      throw new BadRequestException(`库存不足，当前库存: ${inventory.currentQuantity}, 需要: ${dto.quantity}`);
    }

    // 创建出库记录
    const outRecord = new InventoryOutRecord();
    outRecord.inventoryId = dto.inventoryId;
    outRecord.quantity = dto.quantity;
    outRecord.type = dto.type;
    outRecord.batchNumber = dto.batchNumber;
    outRecord.purpose = dto.purpose;
    outRecord.patientId = dto.patientId;
    outRecord.medicalRecordId = dto.medicalRecordId;
    outRecord.operator = dto.operator;
    outRecord.remarks = dto.remarks;

    const savedOutRecord = await this.inventoryOutRecordRepository.save(outRecord);

    // 更新库存数量
    inventory.currentQuantity -= dto.quantity;
    await this.inventoryRepository.save(inventory);

    return {
      code: 200,
      message: '创建出库记录成功',
      data: savedOutRecord,
    };
  }

  /**
   * 删除出库记录
   */
  async deleteInventoryOutRecord(id: string) {
    const record = await this.inventoryOutRecordRepository.findOne({
      where: { id },
      relations: ['inventory'],
    });

    if (!record) {
      throw new NotFoundException(`未找到ID为${id}的出库记录`);
    }

    // 恢复库存数量
    const inventory = record.inventory;
    inventory.currentQuantity += record.quantity;
    await this.inventoryRepository.save(inventory);
    
    await this.inventoryOutRecordRepository.softDelete(id);

    return {
      code: 200,
      message: '删除出库记录成功',
    };
  }

  /**
   * 获取库存统计信息
   */
  async getInventoryStatistics() {
    try {
      // 计算库存总数
      const totalInventory = await this.inventoryRepository.count();
      
      // 计算低库存预警数量
      const lowInventoryCount = await this.inventoryRepository
        .createQueryBuilder('inventory')
        .where('inventory.currentQuantity <= inventory.safetyQuantity')
        .getCount();
      
      // 计算库存为零的数量
      const zeroInventoryCount = await this.inventoryRepository
        .createQueryBuilder('inventory')
        .where('inventory.currentQuantity = 0')
        .getCount();
      
      // 计算最近30天的入库总量
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentInRecords = await this.inventoryInRecordRepository
        .createQueryBuilder('record')
        .select('SUM(record.quantity)', 'totalIn')
        .where('record.createdAt >= :date', { date: thirtyDaysAgo })
        .getRawOne();
      
      // 计算最近30天的出库总量
      const recentOutRecords = await this.inventoryOutRecordRepository
        .createQueryBuilder('record')
        .select('SUM(record.quantity)', 'totalOut')
        .where('record.createdAt >= :date', { date: thirtyDaysAgo })
        .getRawOne();
      
      return {
        code: 200,
        message: '获取库存统计成功',
        data: {
          totalInventory,
          lowInventoryCount,
          zeroInventoryCount,
          recentInQuantity: recentInRecords.totalIn || 0,
          recentOutQuantity: recentOutRecords.totalOut || 0,
          warningPercentage: totalInventory ? Math.round((lowInventoryCount / totalInventory) * 100) : 0,
        },
      };
    } catch (error) {
      this.logger.error(`获取库存统计信息失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取库存盘点列表
   */
  async getStockTakeList(query: StockTakeQueryDto) {
    const { page = 1, pageSize = 10, startDate, endDate, operator, batchNumber } = query;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.stockTakeRepository.createQueryBuilder('stockTake');

    // 按日期范围筛选
    if (startDate && endDate) {
      queryBuilder.andWhere('stockTake.stockTakeDate BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    } else if (startDate) {
      queryBuilder.andWhere('stockTake.stockTakeDate >= :startDate', {
        startDate: new Date(startDate),
      });
    } else if (endDate) {
      queryBuilder.andWhere('stockTake.stockTakeDate <= :endDate', {
        endDate: new Date(endDate),
      });
    }

    // 按操作人筛选
    if (operator) {
      queryBuilder.andWhere('stockTake.operator LIKE :operator', { operator: `%${operator}%` });
    }

    // 按盘点批次号筛选
    if (batchNumber) {
      queryBuilder.andWhere('stockTake.batchNumber LIKE :batchNumber', { batchNumber: `%${batchNumber}%` });
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页
    queryBuilder.skip(skip).take(pageSize);

    // 排序
    queryBuilder.orderBy('stockTake.createdAt', 'DESC');

    // 执行查询
    const items = await queryBuilder.getMany();

    return {
      code: 200,
      message: '获取盘点记录列表成功',
      data: {
        items,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
      },
    };
  }

  /**
   * 获取库存盘点详情
   */
  async getStockTake(id: string) {
    try {
      const stockTake = await this.stockTakeRepository.findOne({ where: { id } });
      if (!stockTake) {
        throw new NotFoundException(`未找到ID为${id}的盘点记录`);
      }

      // 查询盘点项
      const stockTakeItems = await this.stockTakeItemRepository.find({
        where: { stockTakeId: id },
        relations: ['inventory'],
      });

      return {
        code: 200,
        message: '获取盘点记录详情成功',
        data: {
          ...stockTake,
          items: stockTakeItems,
        },
      };
    } catch (error) {
      this.logger.error(`获取库存盘点详情失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 创建库存盘点
   */
  async createStockTake(createStockTakeDto: CreateStockTakeDto) {
    try {
      // 创建盘点记录
      const stockTake = this.stockTakeRepository.create({
        batchNumber: createStockTakeDto.batchNumber,
        stockTakeDate: createStockTakeDto.stockTakeDate ? new Date(createStockTakeDto.stockTakeDate) : new Date(),
        operator: createStockTakeDto.operator,
        remarks: createStockTakeDto.remarks,
      });

      const savedStockTake = await this.stockTakeRepository.save(stockTake);

      // 存储盘点结果摘要
      let totalCount = 0;
      let mismatchCount = 0;
      let totalDifference = 0;

      // 处理盘点项
      for (const item of createStockTakeDto.items) {
        totalCount++;
        
        // 查询库存项
        const inventory = await this.inventoryRepository.findOne({
          where: { id: item.inventoryId },
        });

        if (!inventory) {
          throw new NotFoundException(`未找到ID为${item.inventoryId}的库存项`);
        }

        // 计算差异
        const difference = item.actualQuantity - inventory.currentQuantity;
        
        if (difference !== 0) {
          mismatchCount++;
          totalDifference += Math.abs(difference);
        }

        // 创建盘点项
        const stockTakeItem = this.stockTakeItemRepository.create({
          stockTakeId: savedStockTake.id,
          inventoryId: item.inventoryId,
          systemQuantity: inventory.currentQuantity,
          actualQuantity: item.actualQuantity,
          difference,
          reason: item.reason,
        });

        await this.stockTakeItemRepository.save(stockTakeItem);

        // 更新库存数量
        inventory.currentQuantity = item.actualQuantity;
        await this.inventoryRepository.save(inventory);
      }

      // 更新盘点结果摘要
      savedStockTake.resultSummary = JSON.stringify({
        totalCount,
        mismatchCount,
        mismatchRate: totalCount > 0 ? (mismatchCount / totalCount) * 100 : 0,
        totalDifference,
      });

      await this.stockTakeRepository.save(savedStockTake);

      return {
        code: 200,
        message: '创建盘点记录成功',
        data: savedStockTake,
      };
    } catch (error) {
      this.logger.error(`创建库存盘点失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 删除库存盘点记录
   */
  async deleteStockTake(id: string) {
    try {
      const stockTake = await this.stockTakeRepository.findOne({ where: { id } });
      if (!stockTake) {
        throw new NotFoundException(`未找到ID为${id}的盘点记录`);
      }

      // 删除盘点项
      await this.stockTakeItemRepository.delete({ stockTakeId: id });
      
      // 删除盘点记录
      await this.stockTakeRepository.softDelete(id);

      return {
        code: 200,
        message: '删除盘点记录成功',
      };
    } catch (error) {
      this.logger.error(`删除库存盘点记录失败: ${error.message}`, error.stack);
      throw error;
    }
  }
}
