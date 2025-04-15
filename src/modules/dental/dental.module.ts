import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DentalController } from './dental.controller';
import { DentalService } from './dental.service';
import { MedicalRecord } from './entities/medical-record.entity';
import { Followup } from './entities/followup.entity';
import { Patient } from './patient/entities/patient.entity';
import { Appointment } from './appointment/entities/appointment.entity';
import { Inventory } from './inventory/entities/inventory.entity';
import { InventoryInRecord } from './inventory/entities/inventory-in-record.entity';
import { InventoryOutRecord } from './inventory/entities/inventory-out-record.entity';
import { StockTake } from './inventory/entities/stock-take.entity';
import { StockTakeItem } from './inventory/entities/stock-take-item.entity';
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';
import { InventoryModule } from './inventory/inventory.module';
import { PatientModule } from './patient/patient.module';
import { AppointmentModule } from './appointment/appointment.module';

/**
 * 数据库初始化服务
 * 负责检查牙科模块所需的数据库表是否存在
 * 如果表不存在，则自动创建
 */
@Injectable()
export class DentalDatabaseInitService implements OnModuleInit {
  constructor(@InjectConnection() private connection: Connection) {}

  async onModuleInit() {
    try {
      console.log('正在检查牙科模块所需的数据库表...');

      // 检查需要的数据库表
      const tables = [
        'dental_patients',
        'dental_appointments',
        'dental_medical_records',
        'dental_followups',
        'dental_inventory',
        'dental_inventory_in_record',
        'dental_inventory_out_record',
        'dental_stock_take',
        'dental_stock_take_item',
      ];

      for (const table of tables) {
        const tableExists = await this.checkTableExists(table);
        if (!tableExists) {
          console.log(`表 ${table} 不存在，将尝试自动创建...`);
          await this.createTable(table);
        } else {
          console.log(`表 ${table} 已存在`);
        }
      }

      console.log('牙科模块数据库表检查/创建完成');
    } catch (error) {
      console.error('牙科模块数据库初始化失败:', error);
    }
  }

  private async checkTableExists(tableName: string): Promise<boolean> {
    try {
      const result = await this.connection.query(
        `SELECT COUNT(*) as count FROM information_schema.tables 
         WHERE table_schema = DATABASE() 
         AND table_name = '${tableName}'`,
      );
      return result[0].count > 0;
    } catch (error) {
      console.error(`检查表 ${tableName} 是否存在时出错:`, error);
      return false;
    }
  }

  private async createTable(tableName: string): Promise<void> {
    try {
      switch (tableName) {
        case 'dental_inventory':
          await this.connection.query(`
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
          console.log(`✅ 成功创建表 ${tableName}`);
          break;

        case 'dental_inventory_in_record':
          await this.connection.query(`
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
          console.log(`✅ 成功创建表 ${tableName}`);
          break;

        case 'dental_inventory_out_record':
          await this.connection.query(`
            CREATE TABLE dental_inventory_out_record (
              id VARCHAR(36) NOT NULL PRIMARY KEY,
              inventory_id VARCHAR(36) NOT NULL COMMENT '关联库存ID',
              quantity INT NOT NULL COMMENT '出库数量',
              type VARCHAR(50) NOT NULL COMMENT '出库类型',
              batch_number VARCHAR(100) NULL COMMENT '批次号',
              purpose VARCHAR(255) NULL COMMENT '用途',
              patient_id VARCHAR(36) NULL COMMENT '关联患者ID',
              medical_record_id VARCHAR(36) NULL COMMENT '关联病历ID',
              operator VARCHAR(100) NOT NULL COMMENT '操作人',
              remarks TEXT NULL COMMENT '备注',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
              delete_time TIMESTAMP NULL COMMENT '删除时间',
              FOREIGN KEY (inventory_id) REFERENCES dental_inventory(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='牙科诊所库存出库记录表';
          `);
          console.log(`✅ 成功创建表 ${tableName}`);
          break;

        case 'dental_patients':
          await this.connection.query(`
            CREATE TABLE dental_patients (
              id VARCHAR(36) NOT NULL PRIMARY KEY,
              name VARCHAR(100) NOT NULL COMMENT '患者姓名',
              gender VARCHAR(10) NOT NULL COMMENT '性别',
              birthday DATE NULL COMMENT '出生日期',
              phone VARCHAR(20) NOT NULL COMMENT '联系电话',
              address VARCHAR(255) NULL COMMENT '地址',
              medical_history TEXT NULL COMMENT '病史',
              allergy_history TEXT NULL COMMENT '过敏史',
              occupation VARCHAR(100) NULL COMMENT '职业',
              emergency_contact VARCHAR(100) NULL COMMENT '紧急联系人',
              emergency_phone VARCHAR(20) NULL COMMENT '紧急联系人电话',
              remarks TEXT NULL COMMENT '备注',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
              delete_time TIMESTAMP NULL COMMENT '删除时间'
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='牙科诊所患者信息表';
          `);
          console.log(`✅ 成功创建表 ${tableName}`);
          break;

        case 'dental_appointments':
          await this.connection.query(`
            CREATE TABLE dental_appointments (
              id VARCHAR(36) NOT NULL PRIMARY KEY,
              patient_id VARCHAR(36) NOT NULL COMMENT '患者ID',
              appointment_date DATETIME NOT NULL COMMENT '预约日期时间',
              duration INT NOT NULL DEFAULT 30 COMMENT '预计时长(分钟)',
              type VARCHAR(50) NOT NULL COMMENT '预约类型',
              description TEXT NULL COMMENT '预约描述',
              status VARCHAR(20) NOT NULL DEFAULT 'scheduled' COMMENT '状态',
              doctor VARCHAR(100) NULL COMMENT '主治医生',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
              delete_time TIMESTAMP NULL COMMENT '删除时间',
              FOREIGN KEY (patient_id) REFERENCES dental_patients(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='牙科诊所预约信息表';
          `);
          console.log(`✅ 成功创建表 ${tableName}`);
          break;

        case 'dental_medical_records':
          await this.connection.query(`
            CREATE TABLE dental_medical_records (
              id VARCHAR(36) NOT NULL PRIMARY KEY,
              patient_id VARCHAR(36) NOT NULL COMMENT '患者ID',
              visit_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '就诊日期',
              diagnosis VARCHAR(255) NOT NULL COMMENT '诊断',
              diagnosis_details TEXT NULL COMMENT '诊断详情',
              treatment VARCHAR(255) NOT NULL COMMENT '治疗方案',
              treatment_details TEXT NULL COMMENT '治疗详情',
              medications VARCHAR(255) NULL COMMENT '用药',
              next_visit_plan VARCHAR(255) NULL COMMENT '下次就诊计划',
              status VARCHAR(50) NOT NULL DEFAULT 'active' COMMENT '状态',
              notes TEXT NULL COMMENT '备注',
              doctor_id INT NULL COMMENT '医生ID',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
              delete_time TIMESTAMP NULL COMMENT '删除时间',
              FOREIGN KEY (patient_id) REFERENCES dental_patients(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='牙科诊所病历记录表';
          `);
          console.log(`✅ 成功创建表 ${tableName}`);
          break;

        case 'dental_followups':
          await this.connection.query(`
            CREATE TABLE dental_followups (
              id VARCHAR(36) NOT NULL PRIMARY KEY,
              patient_id VARCHAR(36) NOT NULL COMMENT '患者ID',
              medical_record_id VARCHAR(36) NULL COMMENT '关联病历ID',
              followup_date DATETIME NOT NULL COMMENT '随访日期',
              followup_type VARCHAR(50) NOT NULL COMMENT '随访方式',
              content TEXT NOT NULL COMMENT '随访内容',
              patient_feedback TEXT NULL COMMENT '患者反馈',
              status VARCHAR(50) NOT NULL DEFAULT 'completed' COMMENT '状态',
              notes TEXT NULL COMMENT '备注',
              followed_by VARCHAR(100) NOT NULL COMMENT '随访人员',
              next_followup_date DATETIME NULL COMMENT '下次随访日期',
              create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
              update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
              delete_time TIMESTAMP NULL COMMENT '删除时间',
              FOREIGN KEY (patient_id) REFERENCES dental_patients(id),
              FOREIGN KEY (medical_record_id) REFERENCES dental_medical_records(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='牙科诊所随访记录表';
          `);
          console.log(`✅ 成功创建表 ${tableName}`);
          break;

        case 'dental_stock_take':
          await this.connection.query(`
            CREATE TABLE dental_stock_take (
              id VARCHAR(36) NOT NULL PRIMARY KEY,
              batch_number VARCHAR(100) NULL COMMENT '盘点批次号',
              stock_take_date DATE NULL COMMENT '盘点日期',
              operator VARCHAR(100) NOT NULL COMMENT '操作人',
              remarks TEXT NULL COMMENT '备注',
              result_summary TEXT NULL COMMENT '盘点结果摘要',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
              delete_time TIMESTAMP NULL COMMENT '删除时间'
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='牙科诊所库存盘点表';
          `);
          console.log(`✅ 成功创建表 ${tableName}`);
          break;

        case 'dental_stock_take_item':
          await this.connection.query(`
            CREATE TABLE dental_stock_take_item (
              id VARCHAR(36) NOT NULL PRIMARY KEY,
              stock_take_id VARCHAR(36) NOT NULL COMMENT '盘点ID',
              inventory_id VARCHAR(36) NOT NULL COMMENT '库存项ID',
              system_quantity INT NOT NULL COMMENT '系统记录数量',
              actual_quantity INT NOT NULL COMMENT '实际盘点数量',
              difference INT NOT NULL COMMENT '差异数量',
              reason TEXT NULL COMMENT '差异原因',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
              delete_time TIMESTAMP NULL COMMENT '删除时间',
              FOREIGN KEY (stock_take_id) REFERENCES dental_stock_take(id),
              FOREIGN KEY (inventory_id) REFERENCES dental_inventory(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='牙科诊所库存盘点项表';
          `);
          console.log(`✅ 成功创建表 ${tableName}`);
          break;

        default:
          console.log(`⚠️ 未找到表 ${tableName} 的创建脚本`);
      }
    } catch (error) {
      console.error(`创建表 ${tableName} 时出错:`, error);
    }
  }
}

/**
 * 牙科诊所管理系统模块
 * 用于集中管理牙科诊所管理系统的所有功能
 * 包含患者管理、预约管理、医疗记录等功能
 *
 * API分类结构:
 * 一级分类: 牙科诊所管理
 * 二级分类:
 * - 患者管理: 包括患者的增删改查等操作
 * - 预约管理: 包括预约的增删改查等操作
 * - 病历管理: 包括病历的增删改查等操作
 * - 随访管理: 包括随访记录的增删改查等操作
 */
@Module({
  imports: [
    AuthModule,
    PatientModule,
    AppointmentModule,
    InventoryModule,
    TypeOrmModule.forFeature([
      Patient,
      Appointment,
      MedicalRecord, 
      Followup,
      Inventory,
      InventoryInRecord,
      InventoryOutRecord,
      StockTake,
      StockTakeItem
    ]),
  ],
  controllers: [DentalController],
  providers: [DentalDatabaseInitService, DentalService],
  exports: [DentalService],
})
export class DentalModule {}
