import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixMedicalRecordsColumnNames1744860000000
  implements MigrationInterface
{
  name = 'FixMedicalRecordsColumnNames1744860000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('开始执行医疗记录表字段修复迁移...');

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
        `ALTER TABLE \`dental_medical_records\` DROP FOREIGN KEY IF EXISTS \`FK_dental_medical_records_patient\``,
      );
      await queryRunner.query(
        `ALTER TABLE \`dental_followups\` DROP FOREIGN KEY IF EXISTS \`FK_dental_followups_medical_record\``,
      );
    } catch (e) {
      console.log('外键约束可能不存在，继续执行...');
    }

    // 修复医疗记录表中的列名问题

    // 1. 修复patient_id字段名（如果使用了不同的命名方式）
    const hasPatientId = await checkColumnExists(
      'dental_medical_records',
      'patientId',
    );
    const hasPatient_id = await checkColumnExists(
      'dental_medical_records',
      'patient_id',
    );

    if (!hasPatientId && hasPatient_id) {
      console.log('发现patient_id列，需要重命名为patientId...');
      await safeRenameColumn(
        'dental_medical_records',
        'patient_id',
        'patientId',
        'varchar(36) NULL',
      );
    } else if (!hasPatientId && !hasPatient_id) {
      console.log('创建缺失的patientId列...');
      await safeAddColumn(
        'dental_medical_records',
        'patientId',
        'varchar(36) NULL',
      );
    }

    // 2. 添加主诉字段
    await safeAddColumn(
      'dental_medical_records',
      'chiefComplaint',
      'text NULL',
    );

    // 3. 添加主治医生字段
    await safeAddColumn(
      'dental_medical_records',
      'attendingDoctor',
      'varchar(255) NULL',
    );

    // 4. 尝试将现有数据映射到新字段
    const hasDentistName = await checkColumnExists(
      'dental_medical_records',
      'dentistName',
    );
    const hasAttendingDoctor = await checkColumnExists(
      'dental_medical_records',
      'attendingDoctor',
    );
    const hasSymptoms = await checkColumnExists(
      'dental_medical_records',
      'symptoms',
    );
    const hasChiefComplaint = await checkColumnExists(
      'dental_medical_records',
      'chiefComplaint',
    );

    // 复制数据：dentistName -> attendingDoctor
    if (hasDentistName && hasAttendingDoctor) {
      try {
        await queryRunner.query(`
          UPDATE dental_medical_records 
          SET attendingDoctor = dentistName
          WHERE attendingDoctor IS NULL AND dentistName IS NOT NULL
        `);
        console.log('已将dentistName值复制到attendingDoctor');
      } catch (e) {
        console.error('复制dentistName到attendingDoctor失败:', e);
      }
    }

    // 复制数据：symptoms -> chiefComplaint
    if (hasSymptoms && hasChiefComplaint) {
      try {
        await queryRunner.query(`
          UPDATE dental_medical_records 
          SET chiefComplaint = symptoms
          WHERE chiefComplaint IS NULL AND symptoms IS NOT NULL
        `);
        console.log('已将symptoms值复制到chiefComplaint');
      } catch (e) {
        console.error('复制symptoms到chiefComplaint失败:', e);
      }
    }

    // 5. 确保cost和isPaid字段存在
    await safeAddColumn(
      'dental_medical_records',
      'cost',
      'decimal(10,2) NOT NULL DEFAULT 0.00',
    );
    await safeAddColumn(
      'dental_medical_records',
      'isPaid',
      'tinyint NOT NULL DEFAULT 0',
    );

    // 重新添加外键约束
    try {
      console.log('重新添加外键约束...');
      await queryRunner.query(`
        ALTER TABLE \`dental_medical_records\` 
        ADD CONSTRAINT \`FK_dental_medical_records_patient\` 
        FOREIGN KEY (\`patientId\`) REFERENCES \`dental_patients\`(\`id\`) 
        ON DELETE SET NULL ON UPDATE CASCADE
      `);

      await queryRunner.query(`
        ALTER TABLE \`dental_followups\` 
        ADD CONSTRAINT \`FK_dental_followups_medical_record\` 
        FOREIGN KEY (\`medicalRecordId\`) REFERENCES \`dental_medical_records\`(\`id\`) 
        ON DELETE SET NULL ON UPDATE CASCADE
      `);
    } catch (e) {
      console.error('添加外键约束失败:', e);
    }

    console.log('医疗记录表字段修复完成!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('开始回滚医疗记录表字段修复...');

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
      `ALTER TABLE \`dental_followups\` DROP FOREIGN KEY IF EXISTS \`FK_dental_followups_medical_record\``,
      '删除followups-medical_record外键约束',
    );

    await safeExecute(
      `ALTER TABLE \`dental_medical_records\` DROP FOREIGN KEY IF EXISTS \`FK_dental_medical_records_patient\``,
      '删除medical_records-patient外键约束',
    );

    // 恢复原始列名
    await safeExecute(
      `ALTER TABLE \`dental_medical_records\` CHANGE IF EXISTS \`patientId\` \`patient_id\` varchar(36) NULL`,
      '恢复patient_id列名',
    );

    // 恢复可能被添加的列到原始状态
    await safeExecute(
      `ALTER TABLE \`dental_medical_records\` DROP IF EXISTS \`chiefComplaint\``,
      '删除chiefComplaint列',
    );

    await safeExecute(
      `ALTER TABLE \`dental_medical_records\` DROP IF EXISTS \`attendingDoctor\``,
      '删除attendingDoctor列',
    );

    // 恢复外键约束（使用原始字段名）
    await safeExecute(
      `
      ALTER TABLE \`dental_medical_records\` 
      ADD CONSTRAINT \`FK_dental_medical_records_patient\` 
      FOREIGN KEY (\`patient_id\`) REFERENCES \`dental_patients\`(\`id\`) 
      ON DELETE SET NULL ON UPDATE CASCADE
    `,
      '恢复medical_records-patient外键约束',
    );

    await safeExecute(
      `
      ALTER TABLE \`dental_followups\` 
      ADD CONSTRAINT \`FK_dental_followups_medical_record\` 
      FOREIGN KEY (\`medicalRecordId\`) REFERENCES \`dental_medical_records\`(\`id\`) 
      ON DELETE SET NULL ON UPDATE CASCADE
    `,
      '恢复followups-medical_record外键约束',
    );

    console.log('医疗记录表字段回滚完成!');
  }
}
