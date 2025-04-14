import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixInventoryReferencePrice1744892000000 implements MigrationInterface {
  name = 'FixInventoryReferencePrice1744892000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('开始修复库存表的referencePrice列...');

    try {
      // 检查库存表是否存在
      const tableExists = await this.checkTableExists(queryRunner, 'dental_inventory');
      if (!tableExists) {
        console.log('❌ 库存表不存在，无法修复列');
        return;
      }

      // 检查reference_price列是否存在
      const hasReferencePriceSnake = await this.columnExists(queryRunner, 'dental_inventory', 'reference_price');
      // 检查referencePrice列是否存在
      const hasReferencePriceCamel = await this.columnExists(queryRunner, 'dental_inventory', 'referencePrice');

      if (!hasReferencePriceSnake && !hasReferencePriceCamel) {
        // 两者都不存在，创建reference_price列
        await queryRunner.query(`ALTER TABLE dental_inventory ADD reference_price DECIMAL(10,2) NULL COMMENT '单价参考值'`);
        console.log('✅ 创建了reference_price列');
      } else if (hasReferencePriceCamel && !hasReferencePriceSnake) {
        // 只有驼峰式存在，重命名为下划线式
        await queryRunner.query(`ALTER TABLE dental_inventory CHANGE referencePrice reference_price DECIMAL(10,2) NULL`);
        console.log('✅ 重命名referencePrice列为reference_price');
      } else {
        console.log('ℹ️ reference_price列已存在，无需修复');
      }

      // 检查inventory表的deleteTime列
      const hasDeleteTimeSnake = await this.columnExists(queryRunner, 'dental_inventory', 'delete_time');
      const hasDeleteTimeCamel = await this.columnExists(queryRunner, 'dental_inventory', 'deleteTime');

      if (!hasDeleteTimeSnake && !hasDeleteTimeCamel) {
        // 两者都不存在，创建delete_time列
        await queryRunner.query(`ALTER TABLE dental_inventory ADD delete_time TIMESTAMP NULL COMMENT '删除时间'`);
        console.log('✅ 创建了delete_time列');
      } else if (hasDeleteTimeCamel && !hasDeleteTimeSnake) {
        // 只有驼峰式存在，重命名为下划线式
        await queryRunner.query(`ALTER TABLE dental_inventory CHANGE deleteTime delete_time TIMESTAMP NULL`);
        console.log('✅ 重命名deleteTime列为delete_time');
      } else {
        console.log('ℹ️ delete_time列已存在，无需修复');
      }
      
      console.log('库存表列修复完成!');
    } catch (error) {
      console.error('修复referencePrice列失败:', error);
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('开始回滚referencePrice列修复...');
    console.log('由于是结构修复，不执行具体回滚操作');
    console.log('回滚完成!');
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