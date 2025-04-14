import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixFollowupColumns1744880000000 implements MigrationInterface {
  name = 'FixFollowupColumns1744880000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('开始执行随访记录表字段修复迁移...');

    // 检查列是否存在的函数
    const checkColumnExists = async (table: string, column: string): Promise<boolean> => {
      const columns = await queryRunner.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = (SELECT DATABASE()) 
         AND TABLE_NAME = '${table}' 
         AND COLUMN_NAME = '${column}'`
      );
      return columns.length > 0;
    };

    // 安全添加列
    const safeAddColumn = async (table: string, column: string, definition: string): Promise<void> => {
      try {
        const exists = await checkColumnExists(table, column);
        if (!exists) {
          await queryRunner.query(`ALTER TABLE \`${table}\` ADD \`${column}\` ${definition}`);
          console.log(`✅ 成功添加列: ${table}.${column}`);
        } else {
          console.log(`ℹ️ 列已存在，跳过添加: ${table}.${column}`);
        }
      } catch (e) {
        console.error(`❌ 添加列 ${table}.${column} 失败:`, e);
      }
    };

    // 安全重命名列
    const safeRenameColumn = async (table: string, oldName: string, newName: string, definition: string): Promise<void> => {
      try {
        const oldExists = await checkColumnExists(table, oldName);
        const newExists = await checkColumnExists(table, newName);
        
        if (oldExists && !newExists) {
          await queryRunner.query(`ALTER TABLE \`${table}\` CHANGE \`${oldName}\` \`${newName}\` ${definition}`);
          console.log(`✅ 成功重命名列: ${table}.${oldName} -> ${newName}`);
        } else if (!oldExists && !newExists) {
          await safeAddColumn(table, newName, definition);
        } else if (newExists) {
          console.log(`ℹ️ 目标列已存在: ${table}.${newName}，无需重命名`);
        }
      } catch (e) {
        console.error(`❌ 重命名列 ${table}.${oldName} 失败:`, e);
      }
    };

    try {
      // 修复随访记录表结构
      
      // 1. 确保 followupDate 列存在，可能需要从 scheduledDate 或 completedDate 转换
      const hasFollowupDate = await checkColumnExists('dental_followups', 'followupDate');
      const hasScheduledDate = await checkColumnExists('dental_followups', 'scheduledDate');
      const hasCompletedDate = await checkColumnExists('dental_followups', 'completedDate');
      
      if (!hasFollowupDate) {
        console.log('添加 followupDate 列到随访记录表...');
        await safeAddColumn('dental_followups', 'followupDate', 'datetime NULL');
        
        // 如果有 scheduledDate 或 completedDate，将其中的数据复制到 followupDate
        if (hasScheduledDate) {
          console.log('从 scheduledDate 复制数据到 followupDate...');
          await queryRunner.query(`
            UPDATE dental_followups 
            SET followupDate = scheduledDate
            WHERE followupDate IS NULL AND scheduledDate IS NOT NULL
          `);
        } else if (hasCompletedDate) {
          console.log('从 completedDate 复制数据到 followupDate...');
          await queryRunner.query(`
            UPDATE dental_followups 
            SET followupDate = completedDate
            WHERE followupDate IS NULL AND completedDate IS NOT NULL
          `);
        }
      }
      
      // 2. 将 method 字段重命名为 followupType（如果存在）
      await safeRenameColumn('dental_followups', 'method', 'followupType', 'varchar(255) NULL');
      
      // 3. 确保 content 列存在
      await safeAddColumn('dental_followups', 'content', 'text NULL');
      
      // 4. 确保 patientFeedback 列存在
      await safeAddColumn('dental_followups', 'patientFeedback', 'text NULL');
      
      // 5. 确保 followedBy 列存在
      await safeAddColumn('dental_followups', 'followedBy', 'varchar(255) NULL DEFAULT "未知"');
      
      // 6. 确保 nextFollowupDate 列存在
      await safeAddColumn('dental_followups', 'nextFollowupDate', 'datetime NULL');
      
      console.log('随访记录表字段修复完成!');
    } catch (e) {
      console.error('修复随访记录表字段时发生错误:', e);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('开始回滚随访记录表字段修复...');
    
    // 安全执行查询，忽略错误
    const safeExecute = async (query: string, description: string): Promise<void> => {
      try {
        await queryRunner.query(query);
        console.log(`✅ 成功: ${description}`);
      } catch (e) {
        console.error(`❌ 失败: ${description}`, e);
      }
    };
    
    // 由于我们进行的是复杂的字段转换和添加，很难进行完全回滚
    // 这里我们只尝试恢复可能的原始结构
    
    await safeExecute(
      `ALTER TABLE \`dental_followups\` CHANGE IF EXISTS \`followupType\` \`method\` varchar(255) NULL`, 
      '将 followupType 改回 method 列'
    );
    
    // 其他列不删除，因为可能会丢失数据
    
    console.log('随访记录表字段回滚完成!');
  }
} 