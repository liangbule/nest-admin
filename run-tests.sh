#!/bin/bash

echo "=== 牙科诊所管理系统 API 测试脚本 ==="
echo

# 编译 TypeScript 文件
echo "正在编译 TypeScript 文件..."
npx tsc

# 运行基础 API 测试
echo
echo "=== 运行基础 API 测试 ==="
node dist/test-api.js

# 运行患者和预约模块测试
echo
echo "=== 运行患者和预约模块测试 ==="
node dist/test-patient-appointment.js

echo
echo "所有测试已完成!" 