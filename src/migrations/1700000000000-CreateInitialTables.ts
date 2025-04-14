import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 初始表结构迁移
 * 创建应用程序所需的基础数据库表
 * 包括用户、角色和用户角色关联表
 * 定义表结构、字段类型和约束
 */
export class CreateInitialTables1700000000000 implements MigrationInterface {
  name = 'CreateInitialTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建角色表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
        description VARCHAR(255),
        createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 创建用户表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        nickname VARCHAR(50),
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE,
        avatar VARCHAR(255),
        status TINYINT DEFAULT 1,
        createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 创建用户角色关联表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        user_id INT NOT NULL,
        role_id INT NOT NULL,
        PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS user_roles`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles`);
  }
}
