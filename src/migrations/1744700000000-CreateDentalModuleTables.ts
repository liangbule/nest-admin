import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDentalModuleTables1744700000000 implements MigrationInterface {
  name = 'CreateDentalModuleTables1744700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建患者表
    await queryRunner.query(`
      CREATE TABLE \`dental_patients\` (
        \`id\` varchar(36) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`gender\` varchar(255) NULL,
        \`birthdate\` datetime NULL,
        \`age\` int NULL,
        \`phone\` varchar(255) NULL,
        \`email\` varchar(255) NULL,
        \`address\` varchar(255) NULL,
        \`emergencyContact\` varchar(255) NULL,
        \`emergencyPhone\` varchar(255) NULL,
        \`medicalHistory\` text NULL,
        \`allergies\` text NULL,
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`notes\` text NULL,
        \`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleteTime\` datetime(6) NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // 创建预约表
    await queryRunner.query(`
      CREATE TABLE \`dental_appointments\` (
        \`id\` varchar(36) NOT NULL,
        \`date\` date NOT NULL,
        \`time\` varchar(255) NOT NULL,
        \`duration\` int NOT NULL DEFAULT 30,
        \`type\` varchar(255) NOT NULL,
        \`status\` varchar(255) NOT NULL DEFAULT 'scheduled',
        \`cancellationReason\` varchar(255) NULL,
        \`notes\` text NULL,
        \`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleteTime\` datetime(6) NULL,
        \`patientId\` varchar(36) NULL,
        \`doctorId\` int NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // 创建病历表
    await queryRunner.query(`
      CREATE TABLE \`dental_medical_records\` (
        \`id\` varchar(36) NOT NULL,
        \`visitDate\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`diagnosis\` varchar(255) NOT NULL,
        \`diagnosisDetails\` text NULL,
        \`treatment\` varchar(255) NOT NULL,
        \`treatmentDetails\` text NULL,
        \`medications\` varchar(255) NULL,
        \`nextVisitPlan\` varchar(255) NULL,
        \`status\` varchar(255) NOT NULL DEFAULT 'active',
        \`notes\` text NULL,
        \`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleteTime\` datetime(6) NULL,
        \`patientId\` varchar(36) NULL,
        \`doctorId\` int NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // 创建随访记录表
    await queryRunner.query(`
      CREATE TABLE \`dental_followups\` (
        \`id\` varchar(36) NOT NULL,
        \`method\` varchar(255) NOT NULL,
        \`status\` varchar(255) NOT NULL DEFAULT 'scheduled',
        \`scheduledDate\` date NULL,
        \`completedDate\` date NULL,
        \`content\` text NULL,
        \`notes\` text NULL,
        \`createTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updateTime\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleteTime\` datetime(6) NULL,
        \`patientId\` varchar(36) NULL,
        \`medicalRecordId\` varchar(36) NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // 添加外键约束
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 删除外键约束
    await queryRunner.query(`ALTER TABLE \`dental_followups\` DROP FOREIGN KEY \`FK_dental_followups_medical_record\``);
    await queryRunner.query(`ALTER TABLE \`dental_followups\` DROP FOREIGN KEY \`FK_dental_followups_patient\``);
    await queryRunner.query(`ALTER TABLE \`dental_medical_records\` DROP FOREIGN KEY \`FK_dental_medical_records_patient\``);
    await queryRunner.query(`ALTER TABLE \`dental_appointments\` DROP FOREIGN KEY \`FK_dental_appointments_patient\``);

    // 删除表
    await queryRunner.query(`DROP TABLE \`dental_followups\``);
    await queryRunner.query(`DROP TABLE \`dental_medical_records\``);
    await queryRunner.query(`DROP TABLE \`dental_appointments\``);
    await queryRunner.query(`DROP TABLE \`dental_patients\``);
  }
} 