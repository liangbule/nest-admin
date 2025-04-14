import { MigrationInterface, QueryRunner } from 'typeorm';

export class ForceFixInventoryColumns1744891000000 implements MigrationInterface {
  name = 'ForceFixInventoryColumns1744891000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('开始强制修复库存表结构...');

    try {
      // 1. 先确认是否已经存在要修复的表
      const tableExists = await this.checkTableExists(queryRunner, 'dental_inventory');

      if (!tableExists) {
        // 如果表不存在，创建表
        await this.createInventoryTable(queryRunner);
      } else {
        // 如果表已存在，执行修复
        await this.fixInventoryTable(queryRunner);
      }

      // 同理检查并处理其他表
      const inRecordTableExists = await this.checkTableExists(queryRunner, 'dental_inventory_in_record');
      if (!inRecordTableExists) {
        await this.createInventoryInRecordTable(queryRunner);
      }

      const outRecordTableExists = await this.checkTableExists(queryRunner, 'dental_inventory_out_record');
      if (!outRecordTableExists) {
        await this.createInventoryOutRecordTable(queryRunner);
      }

      console.log('库存相关表修复完成!');
    } catch (error) {
      console.error('修复过程中发生错误:', error);
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('由于是数据修复迁移，没有执行回滚操作');
  }

  private async checkTableExists(queryRunner: QueryRunner, tableName: string): Promise<boolean> {
    try {
      const result = await queryRunner.query(
        `SELECT COUNT(*) as count FROM information_schema.tables 
         WHERE table_schema = DATABASE() 
         AND table_name = '${tableName}'`
      );
      return result[0].count > 0;
    } catch (error) {
      console.error(`检查表 ${tableName} 是否存在时出错:`, error);
      return false;
    }
  }

  private async createInventoryTable(queryRunner: QueryRunner): Promise<void> {
    try {
      console.log('创建库存表...');

      await queryRunner.query(`
        CREATE TABLE dental_inventory (
          id VARCHAR(36) NOT NULL PRIMARY KEY,
          name VARCHAR(255) NOT NULL COMMENT '物品名称',
          code VARCHAR(100) NOT NULL COMMENT '物品编码',
          type VARCHAR(50) NOT NULL COMMENT '物品类型',
          specification VARCHAR(255) NOT NULL COMMENT '规格',
          unit VARCHAR(50) NOT NULL COMMENT '单位',
          current_quantity INT NOT NULL DEFAULT 0 COMMENT '当前库存数量',
          safety_quantity INT NOT NULL DEFAULT 0 COMMENT '安全库存量',
          location VARCHAR(255) NULL COMMENT '存放位置',
          manufacturer VARCHAR(255) NULL COMMENT '品牌/厂家',
          reference_price DECIMAL(10,2) NULL COMMENT '单价参考值',
          remarks TEXT NULL COMMENT '备注',
          status VARCHAR(50) NOT NULL DEFAULT 'active' COMMENT '状态',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
          delete_time TIMESTAMP NULL COMMENT '删除时间'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='牙科诊所库存管理表';
      `);

      console.log('✅ 创建库存表成功');
    } catch (error) {
      console.error('创建库存表失败:', error);
      throw error;
    }
  }

  private async fixInventoryTable(queryRunner: QueryRunner): Promise<void> {
    try {
      console.log('检查库存表列结构...');

      // 1. 检查并修复 current_quantity 列
      if (!(await this.columnExists(queryRunner, 'dental_inventory', 'current_quantity'))) {
        console.log('需要创建 current_quantity 列');
        
        // 先检查是否有 currentQuantity 列（驼峰命名）
        if (await this.columnExists(queryRunner, 'dental_inventory', 'currentQuantity')) {
          // 重命名列
          await queryRunner.query(`ALTER TABLE dental_inventory CHANGE currentQuantity current_quantity INT NOT NULL DEFAULT 0`);
          console.log('✅ 将 currentQuantity 列重命名为 current_quantity');
        } else {
          // 创建列
          await queryRunner.query(`ALTER TABLE dental_inventory ADD current_quantity INT NOT NULL DEFAULT 0 COMMENT '当前库存数量'`);
          console.log('✅ 创建 current_quantity 列');
        }
      } else {
        console.log('current_quantity 列已存在');
      }

      // 2. 检查并修复 safety_quantity 列
      if (!(await this.columnExists(queryRunner, 'dental_inventory', 'safety_quantity'))) {
        console.log('需要创建 safety_quantity 列');
        
        // 先检查是否有 safetyQuantity 列（驼峰命名）
        if (await this.columnExists(queryRunner, 'dental_inventory', 'safetyQuantity')) {
          // 重命名列
          await queryRunner.query(`ALTER TABLE dental_inventory CHANGE safetyQuantity safety_quantity INT NOT NULL DEFAULT 0`);
          console.log('✅ 将 safetyQuantity 列重命名为 safety_quantity');
        } else {
          // 创建列
          await queryRunner.query(`ALTER TABLE dental_inventory ADD safety_quantity INT NOT NULL DEFAULT 0 COMMENT '安全库存量'`);
          console.log('✅ 创建 safety_quantity 列');
        }
      } else {
        console.log('safety_quantity 列已存在');
      }

      // 3. 检查并修复时间相关列
      const timeColumns = [
        { name: 'created_at', definition: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT "创建时间"' },
        { name: 'updated_at', definition: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT "更新时间"' },
        { name: 'delete_time', definition: 'TIMESTAMP NULL COMMENT "删除时间"' }
      ];

      for (const column of timeColumns) {
        if (!(await this.columnExists(queryRunner, 'dental_inventory', column.name))) {
          await queryRunner.query(`ALTER TABLE dental_inventory ADD ${column.name} ${column.definition}`);
          console.log(`✅ 创建 ${column.name} 列`);
        } else {
          console.log(`${column.name} 列已存在`);
        }
      }

      console.log('库存表列结构修复完成');
    } catch (error) {
      console.error('修复库存表结构失败:', error);
      throw error;
    }
  }

  private async createInventoryInRecordTable(queryRunner: QueryRunner): Promise<void> {
    try {
      console.log('创建入库记录表...');

      await queryRunner.query(`
        CREATE TABLE dental_inventory_in_record (
          id VARCHAR(36) NOT NULL PRIMARY KEY,
          inventory_id VARCHAR(36) NOT NULL COMMENT '关联库存ID',
          quantity INT NOT NULL COMMENT '入库数量',
          type VARCHAR(50) NOT NULL COMMENT '入库类型',
          supplier VARCHAR(255) NULL COMMENT '供应商/来源',
          batch_number VARCHAR(100) NULL COMMENT '批次号',
          production_date DATE NULL COMMENT '生产日期',
          expiration_date DATE NULL COMMENT '有效期至',
          unit_price DECIMAL(10,2) NULL COMMENT '单价',
          total_price DECIMAL(10,2) NULL COMMENT '总价',
          operator VARCHAR(100) NOT NULL COMMENT '操作人',
          remarks TEXT NULL COMMENT '备注',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
          delete_time TIMESTAMP NULL COMMENT '删除时间',
          FOREIGN KEY (inventory_id) REFERENCES dental_inventory(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='牙科诊所库存入库记录表';
      `);

      console.log('✅ 创建入库记录表成功');
    } catch (error) {
      console.error('创建入库记录表失败:', error);
      throw error;
    }
  }

  private async createInventoryOutRecordTable(queryRunner: QueryRunner): Promise<void> {
    try {
      console.log('创建出库记录表...');

      await queryRunner.query(`
        CREATE TABLE dental_inventory_out_record (
          id VARCHAR(36) NOT NULL PRIMARY KEY,
          inventory_id VARCHAR(36) NOT NULL COMMENT '关联库存ID',
          quantity INT NOT NULL COMMENT '出库数量',
          type VARCHAR(50) NOT NULL COMMENT '出库类型',
          batch_number VARCHAR(100) NULL COMMENT '批次号',
          purpose VARCHAR(255) NULL COMMENT '用途',
          patient_id VARCHAR(36) NULL COMMENT '患者ID',
          medical_record_id VARCHAR(36) NULL COMMENT '医疗记录ID',
          operator VARCHAR(100) NOT NULL COMMENT '操作人',
          remarks TEXT NULL COMMENT '备注',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
          delete_time TIMESTAMP NULL COMMENT '删除时间',
          FOREIGN KEY (inventory_id) REFERENCES dental_inventory(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='牙科诊所库存出库记录表';
      `);

      console.log('✅ 创建出库记录表成功');
    } catch (error) {
      console.error('创建出库记录表失败:', error);
      throw error;
    }
  }

  private async columnExists(queryRunner: QueryRunner, table: string, column: string): Promise<boolean> {
    try {
      const result = await queryRunner.query(
        `SELECT COUNT(*) as count
         FROM information_schema.columns
         WHERE table_schema = DATABASE()
         AND table_name = '${table}'
         AND column_name = '${column}'`
      );
      return result[0].count > 0;
    } catch (error) {
      console.error(`检查列 ${table}.${column} 是否存在时出错:`, error);
      return false;
    }
  }
} 