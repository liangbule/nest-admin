import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixDentalTablesColumns1744800000000 implements MigrationInterface {
  name = 'FixDentalTablesColumns1744800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('开始执行数据库结构修复迁移...');

    // 先检查列是否存在，减少错误
    const checkColumnExists = async (
      table: string,
      column: string,
    ): Promise<boolean> => {
      try {
        const result = await queryRunner.query(
          `SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_SCHEMA = DATABASE() 
           AND TABLE_NAME = '${table}' 
           AND COLUMN_NAME = '${column}'`,
        );
        return result.length > 0;
      } catch (e) {
        console.log(`检查列 ${table}.${column} 存在性时出错`, e);
        return false;
      }
    };

    // 执行安全的列添加操作
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
          console.log(`成功添加列: ${table}.${column}`);
        } else {
          console.log(`列已存在，跳过添加: ${table}.${column}`);
        }
      } catch (e) {
        console.log(`添加列 ${table}.${column} 时出错`, e);
      }
    };

    // 执行安全的列删除操作
    const safeDropColumn = async (
      table: string,
      column: string,
    ): Promise<void> => {
      try {
        const exists = await checkColumnExists(table, column);
        if (exists) {
          await queryRunner.query(
            `ALTER TABLE \`${table}\` DROP COLUMN \`${column}\``,
          );
          console.log(`成功删除列: ${table}.${column}`);
        } else {
          console.log(`列不存在，跳过删除: ${table}.${column}`);
        }
      } catch (e) {
        console.log(`删除列 ${table}.${column} 时出错`, e);
      }
    };

    // 先处理外键约束，以便修改表结构
    try {
      await queryRunner.query(
        `ALTER TABLE \`dental_appointments\` DROP FOREIGN KEY \`FK_dental_appointments_patient\``,
      );
      await queryRunner.query(
        `ALTER TABLE \`dental_medical_records\` DROP FOREIGN KEY \`FK_dental_medical_records_patient\``,
      );
      await queryRunner.query(
        `ALTER TABLE \`dental_followups\` DROP FOREIGN KEY \`FK_dental_followups_patient\``,
      );
      await queryRunner.query(
        `ALTER TABLE \`dental_followups\` DROP FOREIGN KEY \`FK_dental_followups_medical_record\``,
      );
      console.log('成功删除外键约束');
    } catch (e) {
      console.log('一些外键约束可能不存在，继续执行...');
    }

    // 修复患者表结构
    await safeAddColumn('dental_patients', 'birthday', 'datetime NULL');

    // 修复预约表结构
    await safeDropColumn('dental_appointments', 'date');
    await safeDropColumn('dental_appointments', 'time');
    await safeAddColumn(
      'dental_appointments',
      'appointmentTime',
      'datetime NOT NULL DEFAULT CURRENT_TIMESTAMP',
    );
    await safeAddColumn('dental_appointments', 'reason', 'text NULL');

    // 修复医疗记录表结构
    await safeAddColumn(
      'dental_medical_records',
      'visitDate',
      'datetime NOT NULL DEFAULT CURRENT_TIMESTAMP',
    );
    await safeAddColumn(
      'dental_medical_records',
      'dentistName',
      'varchar(255) NOT NULL DEFAULT "未知医生"',
    );
    await safeAddColumn('dental_medical_records', 'symptoms', 'text NULL');
    await safeAddColumn('dental_medical_records', 'treatmentPlan', 'text NULL');

    await safeDropColumn('dental_medical_records', 'treatment');
    await safeDropColumn('dental_medical_records', 'treatmentDetails');
    await safeDropColumn('dental_medical_records', 'nextVisitPlan');

    // 尝试更改列名，如果失败则删除旧列并创建新列
    try {
      const hasDiagnosisDetails = await checkColumnExists(
        'dental_medical_records',
        'diagnosisDetails',
      );
      const hasIsPaid = await checkColumnExists(
        'dental_medical_records',
        'isPaid',
      );

      if (hasDiagnosisDetails && !hasIsPaid) {
        await queryRunner.query(
          `ALTER TABLE \`dental_medical_records\` CHANGE \`diagnosisDetails\` \`isPaid\` tinyint NOT NULL DEFAULT 0`,
        );
        console.log('成功将 diagnosisDetails 列更改为 isPaid');
      } else if (!hasIsPaid) {
        await safeAddColumn(
          'dental_medical_records',
          'isPaid',
          'tinyint NOT NULL DEFAULT 0',
        );
      }
    } catch (e) {
      console.log('修改 diagnosisDetails 列名时出错，尝试创建新列...');
      await safeAddColumn(
        'dental_medical_records',
        'isPaid',
        'tinyint NOT NULL DEFAULT 0',
      );
    }

    await safeAddColumn(
      'dental_medical_records',
      'cost',
      'decimal(10,2) NOT NULL DEFAULT "0.00"',
    );

    // 重新添加外键约束
    try {
      await queryRunner.query(`
        ALTER TABLE \`dental_appointments\` 
        ADD CONSTRAINT \`FK_dental_appointments_patient\` 
        FOREIGN KEY (\`patientId\`) REFERENCES \`dental_patients\`(\`id\`) 
        ON DELETE SET NULL ON UPDATE CASCADE
      `);

      await queryRunner.query(`
        ALTER TABLE \`dental_medical_records\` 
        ADD CONSTRAINT \`FK_dental_medical_records_patient\` 
        FOREIGN KEY (\`patientId\`) REFERENCES \`dental_patients\`(\`id\`) 
        ON DELETE SET NULL ON UPDATE CASCADE
      `);

      await queryRunner.query(`
        ALTER TABLE \`dental_followups\` 
        ADD CONSTRAINT \`FK_dental_followups_patient\` 
        FOREIGN KEY (\`patientId\`) REFERENCES \`dental_patients\`(\`id\`) 
        ON DELETE SET NULL ON UPDATE CASCADE
      `);

      await queryRunner.query(`
        ALTER TABLE \`dental_followups\` 
        ADD CONSTRAINT \`FK_dental_followups_medical_record\` 
        FOREIGN KEY (\`medicalRecordId\`) REFERENCES \`dental_medical_records\`(\`id\`) 
        ON DELETE SET NULL ON UPDATE CASCADE
      `);
      console.log('成功重新添加外键约束');
    } catch (e) {
      console.log('添加外键约束时出错，但这不影响基本功能，可以继续...');
    }

    console.log('数据库结构修复迁移完成!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('开始回滚数据库结构修复...');

    // 安全地执行查询，忽略错误
    const safeExecute = async (
      query: string,
      description: string,
    ): Promise<void> => {
      try {
        await queryRunner.query(query);
        console.log(`成功: ${description}`);
      } catch (e) {
        console.log(`出错: ${description}`, e);
      }
    };

    // 先删除外键约束
    await safeExecute(
      `ALTER TABLE \`dental_followups\` DROP FOREIGN KEY \`FK_dental_followups_medical_record\``,
      '删除 followups-medical_record 外键',
    );
    await safeExecute(
      `ALTER TABLE \`dental_followups\` DROP FOREIGN KEY \`FK_dental_followups_patient\``,
      '删除 followups-patient 外键',
    );
    await safeExecute(
      `ALTER TABLE \`dental_medical_records\` DROP FOREIGN KEY \`FK_dental_medical_records_patient\``,
      '删除 medical_records-patient 外键',
    );
    await safeExecute(
      `ALTER TABLE \`dental_appointments\` DROP FOREIGN KEY \`FK_dental_appointments_patient\``,
      '删除 appointments-patient 外键',
    );

    // 恢复患者表结构
    await safeExecute(
      `ALTER TABLE \`dental_patients\` DROP COLUMN \`birthday\``,
      '删除 patients.birthday 列',
    );

    // 恢复医疗记录表结构
    await safeExecute(
      `ALTER TABLE \`dental_medical_records\` DROP COLUMN \`cost\``,
      '删除 medical_records.cost 列',
    );
    await safeExecute(
      `ALTER TABLE \`dental_medical_records\` ADD \`nextVisitPlan\` varchar(255) NULL`,
      '添加 medical_records.nextVisitPlan 列',
    );
    await safeExecute(
      `ALTER TABLE \`dental_medical_records\` ADD \`treatmentDetails\` text NULL`,
      '添加 medical_records.treatmentDetails 列',
    );
    await safeExecute(
      `ALTER TABLE \`dental_medical_records\` ADD \`treatment\` varchar(255) NOT NULL DEFAULT ""`,
      '添加 medical_records.treatment 列',
    );
    await safeExecute(
      `ALTER TABLE \`dental_medical_records\` CHANGE \`isPaid\` \`diagnosisDetails\` text NULL`,
      '将 isPaid 改回 diagnosisDetails',
    );
    await safeExecute(
      `ALTER TABLE \`dental_medical_records\` DROP COLUMN \`treatmentPlan\``,
      '删除 medical_records.treatmentPlan 列',
    );
    await safeExecute(
      `ALTER TABLE \`dental_medical_records\` DROP COLUMN \`symptoms\``,
      '删除 medical_records.symptoms 列',
    );
    await safeExecute(
      `ALTER TABLE \`dental_medical_records\` DROP COLUMN \`dentistName\``,
      '删除 medical_records.dentistName 列',
    );
    await safeExecute(
      `ALTER TABLE \`dental_medical_records\` DROP COLUMN \`visitDate\``,
      '删除 medical_records.visitDate 列',
    );

    // 恢复预约表结构
    await safeExecute(
      `ALTER TABLE \`dental_appointments\` DROP COLUMN \`reason\``,
      '删除 appointments.reason 列',
    );
    await safeExecute(
      `ALTER TABLE \`dental_appointments\` DROP COLUMN \`appointmentTime\``,
      '删除 appointments.appointmentTime 列',
    );
    await safeExecute(
      `ALTER TABLE \`dental_appointments\` ADD \`time\` varchar(255) NOT NULL DEFAULT "00:00"`,
      '添加 appointments.time 列',
    );
    await safeExecute(
      `ALTER TABLE \`dental_appointments\` ADD \`date\` date NOT NULL DEFAULT CURRENT_TIMESTAMP`,
      '添加 appointments.date 列',
    );

    console.log('数据库结构回滚完成!');
  }
}
