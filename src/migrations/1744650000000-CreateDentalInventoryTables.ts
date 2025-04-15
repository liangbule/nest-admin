import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDentalInventoryTables1744650000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
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

    // 创建入库记录表
    await queryRunner.query(`
      CREATE TABLE dental_inventory_in_record (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        inventory_id VARCHAR(36) NOT NULL COMMENT '关联库存ID',
        quantity INT NOT NULL COMMENT '入库数量',
        type VARCHAR(50) NOT NULL COMMENT '入库类型',
        unit_price DECIMAL(10,2) NULL COMMENT '单价',
        total_price DECIMAL(10,2) NULL COMMENT '总价',
        supplier VARCHAR(255) NULL COMMENT '供应商',
        batch_number VARCHAR(100) NULL COMMENT '批次号',
        production_date TIMESTAMP NULL COMMENT '生产日期',
        expiration_date TIMESTAMP NULL COMMENT '有效期至',
        operator VARCHAR(100) NOT NULL COMMENT '操作人',
        remarks TEXT NULL COMMENT '备注',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        delete_time TIMESTAMP NULL COMMENT '删除时间',
        CONSTRAINT fk_in_record_inventory FOREIGN KEY (inventory_id) REFERENCES dental_inventory(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='牙科诊所入库记录表';
    `);

    // 创建出库记录表
    await queryRunner.query(`
      CREATE TABLE dental_inventory_out_record (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        inventory_id VARCHAR(36) NOT NULL COMMENT '关联库存ID',
        quantity INT NOT NULL COMMENT '出库数量',
        type VARCHAR(50) NOT NULL COMMENT '出库类型',
        batch_number VARCHAR(100) NULL COMMENT '批次号',
        purpose VARCHAR(255) NULL COMMENT '用途',
        patient_id VARCHAR(36) NULL COMMENT '关联患者ID',
        medical_record_id VARCHAR(36) NULL COMMENT '关联医疗记录ID',
        operator VARCHAR(100) NOT NULL COMMENT '操作人',
        remarks TEXT NULL COMMENT '备注',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
        delete_time TIMESTAMP NULL COMMENT '删除时间',
        CONSTRAINT fk_out_record_inventory FOREIGN KEY (inventory_id) REFERENCES dental_inventory(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='牙科诊所出库记录表';
    `);

    // 创建索引
    await queryRunner.query(
      `CREATE INDEX idx_inventory_code ON dental_inventory(code);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_inventory_name ON dental_inventory(name);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_inventory_type ON dental_inventory(type);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_in_record_inventory_id ON dental_inventory_in_record(inventory_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_in_record_type ON dental_inventory_in_record(type);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_out_record_inventory_id ON dental_inventory_out_record(inventory_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_out_record_type ON dental_inventory_out_record(type);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_out_record_patient_id ON dental_inventory_out_record(patient_id);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 删除表 (按创建的相反顺序)
    await queryRunner.query(
      `DROP TABLE IF EXISTS dental_inventory_out_record;`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS dental_inventory_in_record;`);
    await queryRunner.query(`DROP TABLE IF EXISTS dental_inventory;`);
  }
}
