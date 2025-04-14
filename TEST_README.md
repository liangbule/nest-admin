# Dental Clinic Management System API Testing

This README provides guidance on how to run and understand the API tests for the dental clinic management system.

## Available Test Commands

The following npm scripts are available for testing:

- `npm run test:api` - Run basic API connectivity tests
- `npm run test:patient-api` - Test patient management endpoints
- `npm run test:inventory-api` - Test inventory management endpoints
- `npm run test:dental-api` - Run combined dental clinic API tests
- `npm run test:comprehensive` - Run comprehensive tests for all dental clinic interfaces
- `npm run api:check` - Diagnose API connectivity issues

## Comprehensive API Test

The comprehensive API test (`npm run test:comprehensive`) validates all critical interfaces of the dental clinic management system, including:

- User authentication
- Patient management
- Appointment scheduling
- Medical records
- Follow-up records
- Inventory management

This test provides a thorough validation of the entire API surface and is recommended for complete system verification.

## Inventory Management API Test

The inventory management API test (`npm run test:inventory-api`) focuses specifically on the inventory-related endpoints:

- Inventory items CRUD operations
- Inbound record management
- Outbound record management
- Inventory statistics

This test is useful when developing or troubleshooting the inventory management module. It performs the following operations:

1. Authentication with admin credentials
2. Creating, retrieving, and updating inventory items
3. Creating and retrieving inbound inventory records
4. Creating and retrieving outbound inventory records
5. Fetching inventory statistics
6. Cleaning up all test data

The test logs detailed information about each step and provides a summary of successes and failures.

## Test Configuration

### 准备工作

在运行测试前，确保已安装所有依赖：

```bash
npm install
```

### 遇到问题？首先运行API诊断

如果测试失败，建议先运行API诊断工具来检查服务器状态：

```bash
npm run api:check
```

该工具会：
- 检查API服务器是否在线
- 尝试使用测试账户登录
- 验证关键API端点是否可用
- 分析API响应结构

### 使用 npm scripts 运行测试（推荐）

我们已经在 package.json 中添加了测试命令，可以直接使用以下命令运行测试：

```bash
# 运行所有测试
npm run test:dental-api

# 只运行基础API测试
npm run test:api

# 只运行患者和预约模块测试
npm run test:patient-appointment

# 只运行库存管理模块测试
npm run test:inventory-api
```

### 使用脚本文件运行测试

#### Linux/macOS

使用以下命令运行测试：

```bash
# 添加执行权限
chmod +x run-tests.sh

# 运行测试脚本
./run-tests.sh
```

#### Windows

双击 `run-tests.bat` 文件或在命令提示符中运行：

```
run-tests.bat
```

### 手动运行特定测试

如果您想手动运行特定的测试，可以使用以下命令：

```bash
# 编译 TypeScript 文件
npx tsc

# 运行基础 API 测试
node dist/test-api.js

# 或运行患者和预约模块测试
node dist/test-patient-appointment.js

# 或运行库存管理模块测试
node dist/test-inventory-api.js
```

## 常见测试问题及解决方案

如果您在运行测试时遇到以下问题：

### 1. 认证失败 (401 Unauthorized)

可能的原因：
- 用户名或密码不正确
- 认证接口未实现或路径不正确

解决方案：
- 确认测试脚本中使用的账户凭据正确
- 使用API诊断工具检查认证接口是否可用

### 2. 资源不存在 (404 Not Found)

可能的原因：
- API路径不正确
- 相关接口尚未实现

解决方案：
- 确认API接口已实现
- 检查API路径是否正确

### 3. 数据库错误

可能的原因：
- 数据库查询语句有误
- 数据库表结构与代码不匹配

解决方案：
- 查看服务器日志获取详细错误信息
- 检查数据库表结构

## 测试服务器配置

测试脚本默认连接到 `http://localhost:3000/api` 的API服务器。如果您的服务器地址不同，请修改测试脚本中的 `baseURL` 配置：

```typescript
// 在测试脚本中修改
const API_BASE_URL = 'http://your-api-server/api';  // 修改为您的服务器地址
```

## 测试账户

测试脚本使用以下账户进行测试：

- 用户名: `admin`
- 密码: `admin123`

请确保您的系统中存在此管理员账户。如需使用其他账户，请修改测试脚本中的登录信息。

# 牙科诊所管理系统 API 测试指南

本文档提供了牙科诊所管理系统 API 的测试说明，包括测试脚本的运行方法、测试内容说明以及可能的问题排查。

## 测试脚本概述

系统提供了多个测试脚本，用于测试不同模块的 API 功能：

1. `test-api.ts` - 基础 API 测试，包含认证和用户管理模块的测试
2. `test-patient-api.ts` - 患者管理 API 测试
3. `test-appointments-api.ts` - 预约管理 API 测试
4. `test-medical-records-api.ts` - 病历管理 API 测试
5. `test-followups-api.ts` - 随访管理 API 测试
6. `test-inventory-api.ts` - 库存管理 API 测试

## 运行测试

### 准备工作

1. 确保系统环境已正确配置
2. 确保数据库已正确设置并运行
3. 确保 API 服务已启动并在运行中（默认地址：http://localhost:3000/api）

### 运行单个模块测试

使用以下命令运行特定模块的 API 测试：

```bash
# 基础 API 测试（认证和用户管理）
npm run test:api

# 患者管理 API 测试
npm run test:patient-api

# 预约管理 API 测试
npm run test:appointments-api

# 病历管理 API 测试
npm run test:medical-records-api

# 随访管理 API 测试
npm run test:followups-api

# 库存管理 API 测试
npm run test:inventory-api
```

### 运行全部模块测试

运行所有牙科诊所模块的测试：

```bash
npm run test:dental-api
```

## 测试内容说明

### 1. 基础 API 测试 (test-api.ts)

测试内容：
- 用户登录和认证
- 用户管理（创建、查询、更新、删除）
- 错误处理测试

### 2. 患者管理 API 测试 (test-patient-api.ts)

测试内容：
- 患者 CRUD 操作
- 患者列表查询
- 患者详情获取
- 错误处理测试

### 3. 预约管理 API 测试 (test-appointments-api.ts)

测试内容：
- 创建患者预约
- 获取预约列表
- 获取指定日期的预约
- 更新预约信息
- 取消预约
- 删除预约记录
- 数据清理操作

### 4. 病历管理 API 测试 (test-medical-records-api.ts)

测试内容：
- 创建患者病历
- 获取患者病历列表
- 获取病历详情
- 更新病历信息
- 删除病历记录
- 数据清理操作

### 5. 随访管理 API 测试 (test-followups-api.ts)

测试内容：
- 创建随访记录
- 获取随访记录列表
- 获取随访记录详情
- 更新随访状态
- 删除随访记录
- 数据清理操作

### 6. 库存管理 API 测试 (test-inventory-api.ts)

测试内容：
- 库存物品 CRUD 操作
- 入库记录管理
- 出库记录管理
- 库存统计信息
- 数据清理操作

## 测试数据

测试脚本会自动创建必要的测试数据，包括测试患者、预约、病历等。测试完成后，脚本会尝试清理所创建的测试数据，以保持数据库的干净。

## 登录凭证

测试默认使用以下登录凭证：

```
用户名: root
密码: 123456
```

如需使用其他凭证，请修改相应测试脚本中的 `TEST_USER` 变量。

## 常见问题排查

### 1. 认证失败

- 检查 API 服务是否正常运行
- 验证登录凭证是否正确
- 确认 JWT 认证配置是否正确

### 2. 测试失败但无明确错误信息

- 检查控制台输出中的状态码和错误消息
- 查看服务器日志以获取更详细的错误信息
- 确认数据库连接是否正常

### 3. 清理测试数据失败

- 手动检查并清理测试数据
- 确认数据库的外键约束设置是否正确
- 检查测试脚本中的清理顺序是否合理

## 开发新测试

如需为系统添加新的测试脚本，建议遵循以下步骤：

1. 参考现有测试脚本的结构和模式
2. 确保包含认证、测试数据创建、功能测试和数据清理等环节
3. 使用模块化的方式组织测试函数
4. 添加详细的日志输出，便于问题排查
5. 在 `package.json` 中添加对应的 npm 脚本
6. 更新本文档，添加新测试脚本的说明

## API 文档

如需了解更多 API 详情，请访问 Swagger 文档：http://localhost:3000/api/docs 