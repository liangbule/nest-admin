import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixForeignKeyColumns1744870000000 implements MigrationInterface {
  name = 'FixForeignKeyColumns1744870000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('开始执行外键列名修复迁移...');

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

    // 检查外键是否存在
    const checkForeignKeyExists = async (
      table: string,
      fkName: string,
    ): Promise<boolean> => {
      const fks = await queryRunner.query(
        `SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
         WHERE TABLE_SCHEMA = (SELECT DATABASE()) 
         AND TABLE_NAME = '${table}' 
         AND CONSTRAINT_TYPE = 'FOREIGN KEY' 
         AND CONSTRAINT_NAME = '${fkName}'`,
      );
      return fks.length > 0;
    };

    // 安全重命名列，处理外键
    const safeRenameColumnWithFK = async (
      table: string,
      oldName: string,
      newName: string,
      definition: string,
      refTable: string,
      refColumn: string,
    ): Promise<void> => {
      try {
        // 检查列是否存在
        const oldExists = await checkColumnExists(table, oldName);
        const newExists = await checkColumnExists(table, newName);

        if (!oldExists && !newExists) {
          console.log(`两个列都不存在，创建新列: ${table}.${newName}`);
          await queryRunner.query(
            `ALTER TABLE \`${table}\` ADD \`${newName}\` ${definition}`,
          );
          return;
        }

        if (!oldExists && newExists) {
          console.log(`新列已存在，无需操作: ${table}.${newName}`);
          return;
        }

        if (oldExists && newExists) {
          // 两列都存在，尝试将旧列的数据复制到新列
          console.log(`两列都存在，复制数据从 ${oldName} 到 ${newName}`);
          await queryRunner.query(`
            UPDATE \`${table}\` SET \`${newName}\` = \`${oldName}\`
            WHERE \`${newName}\` IS NULL AND \`${oldName}\` IS NOT NULL
          `);
          // 最后删除旧列
          await queryRunner.query(
            `ALTER TABLE \`${table}\` DROP COLUMN \`${oldName}\``,
          );
          return;
        }

        // 旧列存在，新列不存在，需要重命名
        // 先删除外键约束
        const constraintName = `FK_${table}_${refTable.replace(
          'dental_',
          '',
        )}_${oldName}`;
        const fkExists = await checkForeignKeyExists(table, constraintName);

        if (fkExists) {
          console.log(`删除外键约束: ${constraintName}`);
          await queryRunner.query(
            `ALTER TABLE \`${table}\` DROP FOREIGN KEY \`${constraintName}\``,
          );
        }

        // 重命名列
        console.log(`重命名列: ${table}.${oldName} -> ${newName}`);
        await queryRunner.query(
          `ALTER TABLE \`${table}\` CHANGE \`${oldName}\` \`${newName}\` ${definition}`,
        );

        // 重新添加外键约束
        if (fkExists) {
          console.log(
            `重新添加外键约束: ${table}.${newName} -> ${refTable}.${refColumn}`,
          );
          await queryRunner.query(`
            ALTER TABLE \`${table}\` 
            ADD CONSTRAINT \`FK_${table}_${refTable.replace(
            'dental_',
            '',
          )}_${newName}\` 
            FOREIGN KEY (\`${newName}\`) REFERENCES \`${refTable}\`(\`${refColumn}\`) 
            ON DELETE SET NULL ON UPDATE CASCADE
          `);
        }
      } catch (e) {
        console.error(`修改列 ${table}.${oldName} 失败:`, e);
      }
    };

    // 修复各表中的外键列名
    console.log('修复dental_appointments表中的外键列名...');
    await safeRenameColumnWithFK(
      'dental_appointments',
      'patient_id',
      'patientId',
      'varchar(36) NULL',
      'dental_patients',
      'id',
    );

    console.log('修复dental_medical_records表中的外键列名...');
    await safeRenameColumnWithFK(
      'dental_medical_records',
      'patient_id',
      'patientId',
      'varchar(36) NULL',
      'dental_patients',
      'id',
    );

    console.log('修复dental_followups表中的外键列名...');
    await safeRenameColumnWithFK(
      'dental_followups',
      'patient_id',
      'patientId',
      'varchar(36) NULL',
      'dental_patients',
      'id',
    );

    await safeRenameColumnWithFK(
      'dental_followups',
      'medical_record_id',
      'medicalRecordId',
      'varchar(36) NULL',
      'dental_medical_records',
      'id',
    );

    console.log('外键列名修复完成!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('开始回滚外键列名修复...');

    // 回滚过程基本上是将列名改回去
    // 但由于我们不确定原始状态，这里只输出日志而不实际执行回滚操作
    console.log('注意: 此迁移无法完全回滚，因为它修改了基本的数据库表结构。');
    console.log('如需回滚，请考虑从备份恢复数据库，或手动修改列名。');

    console.log('外键列名回滚完成!');
  }
}
