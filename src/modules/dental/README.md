# 牙科诊所管理系统

## 系统概述

这是一个专为牙科诊所设计的管理系统，提供患者管理、预约管理、病历管理、随访管理、库存管理等功能。

## 项目结构

- **API文档访问地址**: `http://localhost:3000/api/docs`
- **API基础路径**: `/api`
- **测试脚本**: 所有自动化测试脚本位于 `src/test/` 目录下
- **工具脚本**: 所有实用工具脚本位于 `src/script/` 目录下

```
src/
├── modules/
│   └── dental/          # 牙科诊所模块
│       ├── dto/         # 数据传输对象
│       ├── entities/    # 数据库实体
│       ├── controllers/ # 控制器
│       ├── services/    # 服务
│       └── docs/        # 文档
├── test/                # 测试脚本
├── script/              # 工具脚本
└── ...
```

## 功能模块

### 患者管理
提供患者的基本信息管理，包括添加、查询、修改和删除患者资料。

### 预约管理
提供预约的创建、查询、修改和取消功能，支持按日期、医生等条件筛选预约。

### 病历管理
记录患者的病历信息，支持按患者查询病历，记录治疗过程，上传图片等。

### 随访管理
记录患者的随访信息，支持按患者查询随访记录，设置随访提醒等。

### 库存管理
管理诊所的物资库存，包括入库、出库记录，库存统计，低库存提醒等。

### 库存盘点
提供库存盘点功能，记录实际库存数量与系统数量的差异，自动调整库存数量。

## API接口

详细的API接口文档请参考：
- Swagger文档: `http://localhost:3000/api/docs`
- API文档: `src/modules/dental/docs/API_DOCUMENTATION.md`
- Swagger使用指南: `src/modules/dental/docs/SWAGGER_GUIDE.md`
- 库存盘点功能说明: `src/modules/dental/docs/INVENTORY_STOCKTAKE.md`

## 自动化测试

系统提供了完整的自动化测试脚本，位于 `src/test/` 目录下：

```
src/test/
├── inventory-test.ts             # 库存盘点测试
├── test-inventory-api.ts         # 库存管理测试
├── test-patient-api.ts           # 患者管理测试
├── test-appointments-api.ts      # 预约管理测试
├── test-medical-records-api.ts   # 病历管理测试
├── test-followups-api.ts         # 随访管理测试
├── test-patient-appointment.ts   # 患者预约集成测试
├── comprehensive-api-test.ts     # 综合测试
└── ...
```

运行测试：
```bash
# 运行所有测试
npm run test:api

# 运行特定测试
npx ts-node src/test/inventory-test.ts
```

## 工具脚本

系统还提供了一些实用工具脚本，位于 `src/script/` 目录下：

```
src/script/
├── check-db.ts                  # 数据库检查工具
├── restructure-dental.ps1       # 牙科模块重构脚本(PowerShell)
└── script-restructure-dental.sh # 牙科模块重构脚本(Shell)
```

运行工具脚本：
```bash
# 数据库检查
npx ts-node src/script/check-db.ts

# PowerShell脚本 (Windows)
powershell -ExecutionPolicy Bypass -File .\src\script\restructure-dental.ps1

# Shell脚本 (Linux/Mac)
bash ./src/script/script-restructure-dental.sh
```

## 开发指南

### 环境设置
1. 安装依赖: `npm install`
2. 配置环境变量: 复制 `.env.example` 到 `.env` 并填写必要配置
3. 初始化数据库: `npm run db:init`
4. 运行开发服务器: `npm run start:dev`

### 添加新功能
1. 在 `src/modules/dental/entities` 中创建实体
2. 在 `src/modules/dental/dto` 中创建DTO
3. 在 `src/modules/dental/controllers` 中实现控制器
4. 在 `src/modules/dental/services` 中实现服务逻辑
5. 在 `src/modules/dental/docs` 中更新文档
6. 在 `src/test` 中添加测试用例

### 编码规范
1. 遵循TypeScript和NestJS最佳实践
2. 使用明确的命名和注释
3. 为所有公共API编写文档和测试
4. 使用TypeORM实体管理数据库

## 新的目录结构建议

为了提高代码的可维护性和可读性，建议将现有代码按照功能模块重新组织为以下目录结构：

```
src/modules/dental/
├── core/                       # 核心共享代码
│   ├── dental.module.ts        # 模块定义
│   ├── dental.service.ts       # 核心服务
│   └── interfaces/             # 共享接口定义
│
├── patient/                    # 患者管理模块 
│   ├── patient.controller.ts   # 患者控制器
│   ├── patient.service.ts      # 患者服务
│   ├── dto/                    # 患者DTO
│   │   └── patient.dto.ts
│   └── entities/               # 患者实体
│       └── patient.entity.ts
│
├── appointment/                # 预约管理模块
│   ├── appointment.controller.ts
│   ├── appointment.service.ts
│   ├── dto/
│   │   └── appointment.dto.ts
│   └── entities/
│       └── appointment.entity.ts
│
├── medical-record/             # 病历管理模块
│   ├── medical-record.controller.ts
│   ├── medical-record.service.ts
│   ├── dto/
│   │   └── medical-record.dto.ts
│   └── entities/
│       └── medical-record.entity.ts
│
├── followup/                   # 随访管理模块
│   ├── followup.controller.ts
│   ├── followup.service.ts
│   ├── dto/
│   │   └── followup.dto.ts
│   └── entities/
│       └── followup.entity.ts
│
├── inventory/                  # 库存管理模块
│   ├── inventory.controller.ts # 库存控制器
│   ├── inventory.service.ts    # 库存服务
│   ├── dto/                    # 数据传输对象
│   │   ├── inventory.dto.ts
│   │   ├── inventory-in-record.dto.ts
│   │   ├── inventory-out-record.dto.ts
│   │   └── stock-take.dto.ts
│   └── entities/               # 实体定义
│       ├── inventory.entity.ts
│       ├── inventory-in-record.entity.ts
│       ├── inventory-out-record.entity.ts
│       ├── stock-take.entity.ts
│       └── stock-take-item.entity.ts
│
└── docs/                       # 文档
    ├── API_DOCUMENTATION.md    # API文档
    └── SWAGGER_GUIDE.md        # Swagger使用指南
```

## 重构建议

1. **分离控制器**：从当前的 `dental.controller.ts` 中分离出各个功能模块的控制器
   - 创建 `patient.controller.ts`
   - 创建 `appointment.controller.ts`
   - 创建 `medical-record.controller.ts`
   - 创建 `followup.controller.ts`
   - 保留现有的 `inventory.controller.ts`

2. **分离服务逻辑**：从当前庞大的 `dental.service.ts` 中提取各个模块的服务逻辑
   - 创建 `patient.service.ts`
   - 创建 `appointment.service.ts`
   - 创建 `medical-record.service.ts`
   - 创建 `followup.service.ts`
   - 创建 `inventory.service.ts`

3. **更新模块定义**：修改 `dental.module.ts` 以反映新的结构，导入所有分离出的控制器和服务

## 重构收益

1. **提高可维护性**：每个功能模块的代码都集中在自己的目录中，更容易维护
2. **简化代码理解**：开发人员可以更快地理解各个模块的功能和实现
3. **独立开发**：不同模块的开发人员可以独立工作，减少代码冲突
4. **更好的扩展性**：新功能可以更容易地添加到适当的模块中
5. **便于测试**：可以针对特定模块编写单元测试

## 实施步骤

1. 创建新的目录结构
2. 将现有代码分解到适当的文件中
3. 更新导入关系和依赖注入
4. 更新模块定义
5. 测试所有功能确保正常工作

## API文档

请参考 `docs/API_DOCUMENTATION.md` 获取完整的API接口文档。

## API分类结构

本API采用两级分类结构，以便于清晰组织和管理各种功能接口：

### 一级分类：牙科诊所管理

作为顶级分类，统一管理所有与牙科诊所相关的API接口。

### 二级分类：

1. **患者管理**
   - 负责患者基本信息的增删改查操作
   - 包括创建患者、查询患者列表、获取患者详情、更新患者信息、删除患者等功能

2. **预约管理**
   - 负责患者预约信息的增删改查操作
   - 包括创建预约、查询预约列表、按日期查询预约、更新预约信息、取消预约等功能

3. **病历管理**
   - 负责患者病历信息的增删改查操作
   - 包括创建病历、查询病历列表、更新病历信息、删除病历等功能
   - 每条病历记录关联到特定患者

4. **随访管理**
   - 负责患者随访记录的增删改查操作
   - 包括创建随访记录、查询随访列表、更新随访信息、删除随访记录等功能
   - 每条随访记录可关联到特定患者和病历

5. **库存管理**
   - 负责诊所物料库存的增删改查操作
   - 包括库存物品管理、入库记录管理、出库记录管理和库存统计
   - 支持按不同条件查询库存物品、入库和出库记录

## API基础路径

所有API均以`/api/dental`为基础路径，各分类下的具体路径如下：

1. 患者管理：`/api/dental/patients`
2. 预约管理：`/api/dental/appointments`
3. 病历管理：`/api/dental/patients/:patientId/records`和`/api/dental/records`
4. 随访管理：`/api/dental/patients/:patientId/followups`和`/api/dental/followups`
5. 库存管理：
   - 库存物品：`/api/dental/inventory`
   - 入库记录：`/api/dental/inventory/in-records`（创建和单条操作）
   - 出库记录：`/api/dental/inventory/out-records`（创建和单条操作）
   - 入库记录列表：`/api/dental/inventory/records/in/list`
   - 出库记录列表：`/api/dental/inventory/records/out/list`
   - 库存统计：`/api/dental/inventory/statistics`

## 认证方式

所有API均需要进行JWT认证，请在请求头中添加以下信息：

```
Authorization: Bearer your_jwt_token
```

## Swagger文档

完整的API文档可通过Swagger UI查看：
- 访问地址：`http://localhost:3000/api/docs`（端口可能根据配置不同而变化）
- 在Swagger UI中，API已按上述分类进行了组织，便于查找和使用
- 新API添加时，请参考`SWAGGER_GUIDE.md`确保正确配置Swagger装饰器

## 数据结构关系

系统中的实体之间具有以下关系：

1. **Patient（患者）**：
   - 一个患者可以有多个预约（Appointment）
   - 一个患者可以有多个病历（MedicalRecord）
   - 一个患者可以有多个随访记录（Followup）

2. **MedicalRecord（病历）**：
   - 一个病历属于一个患者
   - 一个病历可以有多个随访记录

3. **Appointment（预约）**：
   - 一个预约属于一个患者

4. **Followup（随访）**：
   - 一个随访记录属于一个患者
   - 一个随访记录可以关联到一个病历

5. **Inventory（库存）**：
   - 库存物品（InventoryItem）可以有多个入库记录（InventoryInRecord）
   - 库存物品可以有多个出库记录（InventoryOutRecord）

## 版本更新说明

### 2024-07-12 API路径优化
- 为避免路由冲突，入库和出库记录列表的API路径已更新：
  - 入库记录列表：从`/api/dental/inventory/in-records`修改为`/api/dental/inventory/records/in/list`
  - 出库记录列表：从`/api/dental/inventory/out-records`修改为`/api/dental/inventory/records/out/list`
- 这一更改解决了路径参数`:id`与记录列表获取路径的冲突问题
- 创建操作和单条记录操作的路径保持不变，确保向后兼容性 