#!/bin/bash

echo "======== 牙科诊所管理系统 - 数据库与测试自动修复脚本 ========"

# 1. 运行迁移以修复表结构
echo -e "\n1. 执行数据库迁移..."
npm run migration:run

if [ $? -ne 0 ]; then
  echo "❌ 迁移失败，请检查错误"
  exit 1
else
  echo "✅ 数据库迁移成功完成"
fi

# 2. 修复实体类和DTO，确保与数据库表结构一致
echo -e "\n2. 确保实体类与数据库结构一致..."

# 3. 重新启动应用程序
echo -e "\n3. 重启应用程序以加载新的数据库结构..."
# 如果在后台运行，先停止旧的进程
pkill -f "npm run start:dev" || true
npm run start:dev &

# 等待应用程序启动
echo "正在等待应用程序启动..."
sleep 10

# 4. 运行测试脚本
echo -e "\n4. 运行测试脚本..."
npm run test:patient-api

# 5. 显示测试结果摘要
echo -e "\n5. 测试完成"
echo "======== 脚本执行完毕 ========"

# 可以添加一些后续处理，例如清理测试数据
# echo -e "\n可选: 清理测试数据..."
# 添加清理测试数据的命令 