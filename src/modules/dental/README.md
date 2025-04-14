# 牙科诊所管理系统API文档

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