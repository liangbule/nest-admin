import { createConnection } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

// 加载环境变量
config();

async function checkDatabase() {
  console.log('正在连接数据库...');

  try {
    // 创建数据库连接
    const connection = await createConnection({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'my_nest_admin',
      entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
    });

    console.log('数据库连接成功!');

    // 检查dental_inventory表是否存在
    console.log('检查牙科诊所库存相关表是否存在...');

    const tables = [
      'dental_inventory',
      'dental_inventory_in_record',
      'dental_inventory_out_record',
    ];

    for (const table of tables) {
      try {
        const result = await connection.query(`SHOW TABLES LIKE '${table}'`);
        if (result.length === 0) {
          console.log(`[缺失] 表 ${table} 不存在，需要创建`);
        } else {
          console.log(`[存在] 表 ${table} 已存在`);
          // 可选：查询表结构
          const columns = await connection.query(`DESCRIBE ${table}`);
          console.log(`表 ${table} 的结构:`);
          console.table(columns);
        }
      } catch (error) {
        console.error(`检查表 ${table} 时出错:`, error.message);
      }
    }

    // 关闭连接
    await connection.close();
    console.log('数据库连接已关闭');
  } catch (error) {
    console.error('数据库连接失败:', error.message);
    if (error.name === 'TypeORMError') {
      console.error('TypeORM错误详情:', error);
    }
  }
}

// 运行检查
checkDatabase()
  .then(() => console.log('数据库检查完成'))
  .catch((error) => console.error('执行检查时出错:', error));
