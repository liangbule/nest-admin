import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixAppointmentsColumnNames1744850000000
  implements MigrationInterface
{
  name = 'FixAppointmentsColumnNames1744850000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('开始执行预约表字段修复迁移...');

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

    // 安全重命名列
    const safeRenameColumn = async (
      table: string,
      oldName: string,
      newName: string,
      definition: string,
    ): Promise<void> => {
      try {
        const oldExists = await checkColumnExists(table, oldName);
        const newExists = await checkColumnExists(table, newName);

        if (oldExists && !newExists) {
          await queryRunner.query(
            `ALTER TABLE \`${table}\` CHANGE \`${oldName}\` \`${newName}\` ${definition}`,
          );
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

    // 先处理外键约束，以便修改表结构
    try {
      console.log('正在临时删除外键约束...');
      await queryRunner.query(
        `ALTER TABLE \`dental_appointments\` DROP FOREIGN KEY IF EXISTS \`FK_dental_appointments_patient\``,
      );
    } catch (e) {
      console.log('外键约束可能不存在，继续执行...');
    }

    // 修复预约表中的列名问题

    // 1. 修复patient_id字段名（如果使用了不同的命名方式）
    const hasPatientId = await checkColumnExists(
      'dental_appointments',
      'patientId',
    );
    const hasPatient_id = await checkColumnExists(
      'dental_appointments',
      'patient_id',
    );

    if (!hasPatientId && hasPatient_id) {
      console.log('发现patient_id列，需要重命名为patientId...');
      await safeRenameColumn(
        'dental_appointments',
        'patient_id',
        'patientId',
        'varchar(36) NULL',
      );
    } else if (!hasPatientId && !hasPatient_id) {
      console.log('创建缺失的patientId列...');
      await safeAddColumn(
        'dental_appointments',
        'patientId',
        'varchar(36) NULL',
      );
    }

    // 2. 确保appointmentTime列存在
    const hasAppointmentTime = await checkColumnExists(
      'dental_appointments',
      'appointmentTime',
    );
    if (!hasAppointmentTime) {
      console.log('添加appointmentTime列...');
      await safeAddColumn(
        'dental_appointments',
        'appointmentTime',
        'datetime NOT NULL DEFAULT CURRENT_TIMESTAMP',
      );

      // 如果有date和time列，尝试合并数据到appointmentTime
      const hasDate = await checkColumnExists('dental_appointments', 'date');
      const hasTime = await checkColumnExists('dental_appointments', 'time');

      if (hasDate && hasTime) {
        try {
          console.log('正在合并date和time列到appointmentTime...');
          await queryRunner.query(`
            UPDATE dental_appointments 
            SET appointmentTime = CONCAT(date, ' ', IFNULL(time, '00:00'))
            WHERE appointmentTime IS NULL OR appointmentTime = '0000-00-00 00:00:00'
          `);
        } catch (e) {
          console.error('合并date和time数据失败:', e);
        }
      }
    }

    // 3. 添加其他可能缺失的字段
    await safeAddColumn('dental_appointments', 'reason', 'text NULL');

    // 重新添加外键约束
    try {
      console.log('重新添加外键约束...');
      await queryRunner.query(`
        ALTER TABLE \`dental_appointments\` 
        ADD CONSTRAINT \`FK_dental_appointments_patient\` 
        FOREIGN KEY (\`patientId\`) REFERENCES \`dental_patients\`(\`id\`) 
        ON DELETE SET NULL ON UPDATE CASCADE
      `);
    } catch (e) {
      console.error(
        '添加外键约束失败，可能是patientId与患者表的id类型不匹配:',
        e,
      );
    }

    console.log('预约表字段修复完成!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('开始回滚预约表字段修复...');

    // 安全执行查询，忽略错误
    const safeExecute = async (
      query: string,
      description: string,
    ): Promise<void> => {
      try {
        await queryRunner.query(query);
        console.log(`✅ 成功: ${description}`);
      } catch (e) {
        console.error(`❌ 失败: ${description}`, e);
      }
    };

    // 先删除外键约束
    await safeExecute(
      `ALTER TABLE \`dental_appointments\` DROP FOREIGN KEY IF EXISTS \`FK_dental_appointments_patient\``,
      '删除外键约束',
    );

    // 恢复原始列名
    await safeExecute(
      `ALTER TABLE \`dental_appointments\` CHANGE IF EXISTS \`patientId\` \`patient_id\` varchar(36) NULL`,
      '恢复patient_id列名',
    );

    // 恢复可能被删除的列
    await safeExecute(
      `ALTER TABLE \`dental_appointments\` ADD IF NOT EXISTS \`date\` date NOT NULL DEFAULT CURRENT_TIMESTAMP`,
      '恢复date列',
    );

    await safeExecute(
      `ALTER TABLE \`dental_appointments\` ADD IF NOT EXISTS \`time\` varchar(255) NOT NULL DEFAULT '00:00'`,
      '恢复time列',
    );

    // 尝试从appointmentTime分离数据到date和time
    await safeExecute(
      `
      UPDATE dental_appointments 
      SET 
        date = DATE(appointmentTime),
        time = TIME(appointmentTime)
      WHERE appointmentTime IS NOT NULL
    `,
      '从appointmentTime恢复数据到date和time',
    );

    // 恢复外键约束（使用原始字段名）
    await safeExecute(
      `
      ALTER TABLE \`dental_appointments\` 
      ADD CONSTRAINT \`FK_dental_appointments_patient\` 
      FOREIGN KEY (\`patient_id\`) REFERENCES \`dental_patients\`(\`id\`) 
      ON DELETE SET NULL ON UPDATE CASCADE
    `,
      '恢复外键约束',
    );

    console.log('预约表字段回滚完成!');
  }
}
