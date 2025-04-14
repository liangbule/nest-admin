import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 添加角色表缺少的列
 * 为角色表补充实体定义中所需的列
 * 包括状态、创建时间和更新时间等
 * 解决实体与数据库结构不一致的问题
 */
export class AddMissingRoleColumns1713000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 检查列是否存在，如果不存在则添加
    const hasStatus = await this.columnExists(queryRunner, 'roles', 'status');
    if (!hasStatus) {
      await queryRunner.query(
        'ALTER TABLE roles ADD COLUMN status TINYINT DEFAULT 1',
      );
    }

    const hasCreateTime = await this.columnExists(
      queryRunner,
      'roles',
      'createTime',
    );
    if (!hasCreateTime) {
      await queryRunner.query(
        'ALTER TABLE roles ADD COLUMN createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      );
    }

    const hasUpdateTime = await this.columnExists(
      queryRunner,
      'roles',
      'updateTime',
    );
    if (!hasUpdateTime) {
      await queryRunner.query(
        'ALTER TABLE roles ADD COLUMN updateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 删除添加的列
    await queryRunner.query('ALTER TABLE roles DROP COLUMN IF EXISTS status');
    await queryRunner.query(
      'ALTER TABLE roles DROP COLUMN IF EXISTS createTime',
    );
    await queryRunner.query(
      'ALTER TABLE roles DROP COLUMN IF EXISTS updateTime',
    );
  }

  // 辅助方法：检查列是否存在
  private async columnExists(
    queryRunner: QueryRunner,
    table: string,
    column: string,
  ): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as count
      FROM information_schema.columns
      WHERE table_schema = '${queryRunner.connection.options.database}'
      AND table_name = '${table}'
      AND column_name = '${column}'
    `;
    const result = await queryRunner.query(query);
    return result[0].count > 0;
  }
}
