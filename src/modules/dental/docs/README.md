# 牙科诊所管理系统文档

## 目录结构

```
docs/
├── README.md             # 本文件，文档目录说明
├── SWAGGER_GUIDE.md      # Swagger使用指南
├── API_DOCUMENTATION.md  # API文档总体说明
├── INVENTORY_STOCKTAKE.md # 库存盘点流程说明
└── api/                  # API详细文档目录
    ├── inventory-management-zh.md   # 库存管理API文档
    ├── stocktake-management-zh.md   # 库存盘点API文档
    └── patient-management-zh.md     # 患者管理API文档
```

## 文档说明

### API文档

API详细文档位于`api`目录下，按模块分类：

- **库存管理API** (inventory-management-zh.md)：包含库存物品CRUD、入库记录、出库记录、库存统计等接口说明
- **库存盘点API** (stocktake-management-zh.md)：包含盘点记录管理、盘点统计等接口说明
- **患者管理API** (patient-management-zh.md)：包含患者信息管理、预约管理、病历记录、账单管理等接口说明

### 使用指南

- **Swagger使用指南** (SWAGGER_GUIDE.md)：介绍如何使用Swagger测试和查看API
- **API文档说明** (API_DOCUMENTATION.md)：API整体结构和使用规范
- **库存盘点流程** (INVENTORY_STOCKTAKE.md)：库存盘点业务流程和操作说明

## 文档维护指南

1. 所有API文档使用中文编写，文件名以`-zh`结尾
2. 文档采用Markdown格式
3. API文档需包含以下内容：
   - 接口说明
   - 请求方法和URL
   - 请求参数
   - 响应格式
   - 错误码
   - 示例

4. 文档更新后，请在文件底部更新"最后更新时间"

---

最后更新时间：2023年7月1日

本目录包含牙科诊所管理系统各模块的详细文档，包括架构设计、API接口规范、数据库设计和使用指南。

## 文档结构

| 目录/文件 | 描述 |
|------|------|
| `api/` | API接口文档 |
| `database/` | 数据库设计文档 |
| `architecture/` | 系统架构设计文档 |
| `user-guides/` | 用户使用指南 |
| `development/` | 开发指南 |

## API文档

API文档详细记录了系统提供的各种接口，包括：

- 请求方法与URL
- 请求参数说明
- 响应格式与状态码
- 示例请求与响应
- 错误处理
- 权限要求

系统同时提供自动生成的Swagger文档，可通过运行项目并访问`/api-docs`路径查看。

## 数据库设计

数据库设计文档包含：

- 实体关系图(ERD)
- 表结构设计
- 索引设计
- 关系约束
- 数据字典

## 架构设计

架构设计文档描述了系统的整体架构，包括：

- 系统层次结构
- 模块划分
- 技术栈选择
- 设计模式应用
- 安全性设计
- 扩展性设计

## 用户指南

用户指南提供系统各功能模块的使用说明，包括：

- 预约管理
- 患者管理
- 医疗记录管理
- 库存管理
- 结算与财务
- 报表与统计

## 开发指南

开发指南为开发人员提供了详细的指导，包括：

- 开发环境搭建
- 编码规范
- 测试指南
- 部署流程
- API开发流程
- 前端集成指南

## 文档维护

### 如何更新文档

1. 文档使用Markdown格式编写
2. 所有更新应包含日期和作者信息
3. 重大更改应在文档的变更历史部分记录
4. API变更应同时更新自动生成的Swagger文档

### 文档生成

部分文档可以通过工具自动生成：

```bash
# 生成API文档
npm run generate:docs

# 生成数据库设计文档
npm run generate:db-docs
```

## 贡献指南

为文档做贡献时，请遵循以下准则：

1. 使用清晰、简洁的语言
2. 为复杂概念提供示例
3. 保持文档的一致性和最新状态
4. 在提交前检查拼写和格式
5. 遵循项目的文档模板和风格指南

## 相关资源

- [项目GitHub仓库](https://github.com/example/dental-clinic)
- [项目Wiki](https://github.com/example/dental-clinic/wiki)
- [在线演示](https://demo.example.com)
- [问题跟踪](https://github.com/example/dental-clinic/issues) 