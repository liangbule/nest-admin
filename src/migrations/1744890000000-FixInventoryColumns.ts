import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixInventoryColumns1744890000000 implements MigrationInterface {
  name = 'FixInventoryColumns1744890000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('开始执行库存表列修复迁移...');

    // 检查列是否存在的函数
    const checkColumnExists = async (
      table: string,
      column: string,
    ): Promise<boolean> => {
      const columns = await queryRunner.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = (SELECT DATABASE()) 
         AND TABLE_NAME = '${table}' 
         AND COLUMN_NAME = '${column}'`,
      );
      return columns.length > 0;
    };

    // 安全添加列
    const safeAddColumn = async (
      table: string,
      column: string,
      definition: string,
    ): Promise<void> => {
      try {
        const exists = await checkColumnExists(table, column);
        if (!exists) {
          await queryRunner.query(
            `ALTER TABLE \`${table}\` ADD \`${column}\` ${definition}`,
          );
          console.log(`✅ 成功添加列: ${table}.${column}`);
        } else {
          console.log(`ℹ️ 列已存在，跳过添加: ${table}.${column}`);
        }
      } catch (e) {
        console.error(`❌ 添加列 ${table}.${column} 失败:`, e);
      }
    };

    try {
      // 检查表是否存在
      const tableExists = await queryRunner.query(
        `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
         WHERE TABLE_SCHEMA = (SELECT DATABASE()) 
         AND TABLE_NAME = 'dental_inventory'`,
      );

      if (tableExists.length === 0) {
        console.log('⚠️ 库存表不存在，创建库存表...');

        // 创建库存表
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
        console.log('✅ 成功创建库存表');
      } else {
        console.log('库存表已存在，检查列结构...');

        // 检查并添加必要的列
        const hasCurrentQuantity = await checkColumnExists(
          'dental_inventory',
          'current_quantity',
        );
        const hasSafetyQuantity = await checkColumnExists(
          'dental_inventory',
          'safety_quantity',
        );
        const hasCurrentQuantityCamel = await checkColumnExists(
          'dental_inventory',
          'currentQuantity',
        );
        const hasSafetyQuantityCamel = await checkColumnExists(
          'dental_inventory',
          'safetyQuantity',
        );

        if (!hasCurrentQuantity && !hasCurrentQuantityCamel) {
          await safeAddColumn(
            'dental_inventory',
            'current_quantity',
            'INT NOT NULL DEFAULT 0 COMMENT "当前库存数量"',
          );
        } else if (hasCurrentQuantityCamel && !hasCurrentQuantity) {
          await queryRunner.query(
            `ALTER TABLE dental_inventory CHANGE currentQuantity current_quantity INT NOT NULL DEFAULT 0`,
          );
          console.log('✅ 重命名 currentQuantity 为 current_quantity');
        }

        if (!hasSafetyQuantity && !hasSafetyQuantityCamel) {
          await safeAddColumn(
            'dental_inventory',
            'safety_quantity',
            'INT NOT NULL DEFAULT 0 COMMENT "安全库存量"',
          );
        } else if (hasSafetyQuantityCamel && !hasSafetyQuantity) {
          await queryRunner.query(
            `ALTER TABLE dental_inventory CHANGE safetyQuantity safety_quantity INT NOT NULL DEFAULT 0`,
          );
          console.log('✅ 重命名 safetyQuantity 为 safety_quantity');
        }

        // 检查创建和更新时间字段
        const hasCreatedAt = await checkColumnExists(
          'dental_inventory',
          'created_at',
        );
        const hasUpdatedAt = await checkColumnExists(
          'dental_inventory',
          'updated_at',
        );
        const hasDeleteTime = await checkColumnExists(
          'dental_inventory',
          'delete_time',
        );

        if (!hasCreatedAt) {
          await safeAddColumn(
            'dental_inventory',
            'created_at',
            'TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT "创建时间"',
          );
        }

        if (!hasUpdatedAt) {
          await safeAddColumn(
            'dental_inventory',
            'updated_at',
            'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT "更新时间"',
          );
        }

        if (!hasDeleteTime) {
          await safeAddColumn(
            'dental_inventory',
            'delete_time',
            'TIMESTAMP NULL COMMENT "删除时间"',
          );
        }
      }

      console.log('库存表结构修复完成');

      // 检查入库记录表结构
      const inRecordTableExists = await queryRunner.query(
        `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
         WHERE TABLE_SCHEMA = (SELECT DATABASE()) 
         AND TABLE_NAME = 'dental_inventory_in_record'`,
      );

      if (inRecordTableExists.length === 0) {
        console.log('⚠️ 入库记录表不存在，创建入库记录表...');

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
            FOREIGN KEY (inventory_id) REFERENCES dental_inventory(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='牙科诊所库存入库记录表';
        `);
        console.log('✅ 成功创建入库记录表');
      }

      // 检查出库记录表结构
      const outRecordTableExists = await queryRunner.query(
        `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
         WHERE TABLE_SCHEMA = (SELECT DATABASE()) 
         AND TABLE_NAME = 'dental_inventory_out_record'`,
      );

      if (outRecordTableExists.length === 0) {
        console.log('⚠️ 出库记录表不存在，创建出库记录表...');

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
            FOREIGN KEY (inventory_id) REFERENCES dental_inventory(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='牙科诊所库存出库记录表';
        `);
        console.log('✅ 成功创建出库记录表');
      }

      console.log('库存相关表修复完成!');
    } catch (e) {
      console.error('修复库存表结构时发生错误:', e);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('开始回滚库存表列修复...');
    console.log('由于这是结构修复，不执行具体回滚操作，以防止数据丢失');
    console.log('库存表列回滚完成!');
  }
}
