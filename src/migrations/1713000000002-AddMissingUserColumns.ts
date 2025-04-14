import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 添加用户表缺少的列
 * 为用户表补充实体定义中所需的列
 * 包括昵称、头像、创建时间和更新时间等
 * 解决实体与数据库结构不一致的问题
 */
export class AddMissingUserColumns1713000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 检查列是否存在，如果不存在则添加
    const hasNickname = await this.columnExists(
      queryRunner,
      'users',
      'nickname',
    );
    if (!hasNickname) {
      await queryRunner.query(
        'ALTER TABLE users ADD COLUMN nickname VARCHAR(50) NULL',
      );
    }

    const hasAvatar = await this.columnExists(queryRunner, 'users', 'avatar');
    if (!hasAvatar) {
      await queryRunner.query(
        'ALTER TABLE users ADD COLUMN avatar VARCHAR(255) NULL',
      );
    }

    const hasCreateTime = await this.columnExists(
      queryRunner,
      'users',
      'createTime',
    );
    if (!hasCreateTime) {
      await queryRunner.query(
        'ALTER TABLE users ADD COLUMN createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      );
    }

    const hasUpdateTime = await this.columnExists(
      queryRunner,
      'users',
      'updateTime',
    );
    if (!hasUpdateTime) {
      await queryRunner.query(
        'ALTER TABLE users ADD COLUMN updateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 删除添加的列
    await queryRunner.query('ALTER TABLE users DROP COLUMN IF EXISTS nickname');
    await queryRunner.query('ALTER TABLE users DROP COLUMN IF EXISTS avatar');
    await queryRunner.query(
      'ALTER TABLE users DROP COLUMN IF EXISTS createTime',
    );
    await queryRunner.query(
      'ALTER TABLE users DROP COLUMN IF EXISTS updateTime',
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
