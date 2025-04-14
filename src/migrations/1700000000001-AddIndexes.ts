import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 添加索引迁移
 * 为数据库表添加必要的索引以提高查询性能
 * 包括用户名、邮箱等常用查询字段的索引
 * 优化数据库访问效率和响应时间
 */
export class AddIndexes1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 添加用户表索引
    await queryRunner.query(
      'CREATE INDEX idx_users_username ON users (username)',
    );
    await queryRunner.query('CREATE INDEX idx_users_email ON users (email)');

    // 添加角色表索引
    await queryRunner.query('CREATE INDEX idx_roles_name ON roles (name)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 删除用户表索引
    await queryRunner.query('DROP INDEX idx_users_username ON users');
    await queryRunner.query('DROP INDEX idx_users_email ON users');

    // 删除角色表索引
    await queryRunner.query('DROP INDEX idx_roles_name ON roles');
  }
}
