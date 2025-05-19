# 库存管理 API 文档

## 概述
库存管理API提供了对牙科诊所物资的全面管理能力，包括库存物品管理、入库/出库记录、库存查询和统计功能。

## 库存物品管理

### 获取库存列表
获取分页的库存物品列表，支持多种筛选条件。

**请求**
- 方法: `GET`
- 接口: `/api/dental/inventory`
- 查询参数:
  - `page`: 页码（默认: 1）
  - `pageSize`: 每页数量（默认: 10）
  - `name`: 按名称筛选
  - `type`: 按类型筛选
  - `status`: 按状态筛选

**响应**
```json
{
  "code": 200,
  "message": "获取库存列表成功",
  "data": {
    "total": 50,
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "一次性口罩",
        "code": "MASK001",
        "type": "consumable",
        "specification": "50个/盒",
        "unit": "盒",
        "quantity": 100,
        "safetyQuantity": 20,
        "status": "normal",
        "createdAt": "2023-01-15T08:30:00.000Z",
        "updatedAt": "2023-05-01T11:45:00.000Z"
      },
      // 更多物品...
    ]
  }
}
```

### 获取库存详情
根据ID获取特定库存物品的详细信息。

**请求**
- 方法: `GET`
- 接口: `/api/dental/inventory/:id`
- 路径参数:
  - `id`: 库存物品ID

**响应**
```json
{
  "code": 200,
  "message": "获取库存详情成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "一次性口罩",
    "code": "MASK001",
    "type": "consumable",
    "specification": "50个/盒",
    "unit": "盒",
    "quantity": 100,
    "safetyQuantity": 20,
    "status": "normal",
    "remarks": "N95标准",
    "createdAt": "2023-01-15T08:30:00.000Z",
    "updatedAt": "2023-05-01T11:45:00.000Z",
    "recentTransactions": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "type": "in",
        "quantity": 50,
        "operator": "张医生",
        "createdAt": "2023-04-15T09:30:00.000Z"
      },
      {
        "id": "660e8400-e29b-41d4-a716-446655440002",
        "type": "out",
        "quantity": 10,
        "operator": "李护士",
        "createdAt": "2023-04-28T14:20:00.000Z"
      }
    ]
  }
}
```

### 创建库存物品
创建新的库存物品记录。

**请求**
- 方法: `POST`
- 接口: `/api/dental/inventory`
- 请求体:
```json
{
  "name": "医用手套",
  "code": "GLOVE001",
  "type": "consumable",
  "specification": "100个/盒",
  "unit": "盒",
  "quantity": 50,
  "safetyQuantity": 10,
  "remarks": "乳胶材质，中号"
}
```

**响应**
```json
{
  "code": 201,
  "message": "创建库存物品成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "医用手套",
    "code": "GLOVE001",
    "type": "consumable",
    "specification": "100个/盒",
    "unit": "盒",
    "quantity": 50,
    "safetyQuantity": 10,
    "status": "normal",
    "remarks": "乳胶材质，中号",
    "createdAt": "2023-06-01T10:15:00.000Z",
    "updatedAt": "2023-06-01T10:15:00.000Z"
  }
}
```

### 更新库存物品
更新现有库存物品的信息。

**请求**
- 方法: `PUT`
- 接口: `/api/dental/inventory/:id`
- 路径参数:
  - `id`: 库存物品ID
- 请求体:
```json
{
  "name": "医用手套",
  "specification": "100个/盒",
  "safetyQuantity": 15,
  "remarks": "乳胶材质，中号，无粉"
}
```

**响应**
```json
{
  "code": 200,
  "message": "更新库存物品成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "医用手套",
    "code": "GLOVE001",
    "type": "consumable",
    "specification": "100个/盒",
    "unit": "盒",
    "quantity": 50,
    "safetyQuantity": 15,
    "status": "normal",
    "remarks": "乳胶材质，中号，无粉",
    "createdAt": "2023-06-01T10:15:00.000Z",
    "updatedAt": "2023-06-01T11:30:00.000Z"
  }
}
```

### 删除库存物品
删除特定库存物品。

**请求**
- 方法: `DELETE`
- 接口: `/api/dental/inventory/:id`
- 路径参数:
  - `id`: 库存物品ID

**响应**
```json
{
  "code": 200,
  "message": "删除库存物品成功"
}
```

## 入库记录管理

### 获取入库记录列表
获取所有入库记录的分页列表。

**请求**
- 方法: `GET`
- 接口: `/api/dental/inventory/records/in/list`
- 查询参数:
  - `page`: 页码（默认: 1）
  - `pageSize`: 每页数量（默认: 10）
  - `inventoryId`: 按库存物品ID筛选
  - `startDate`: 开始日期
  - `endDate`: 结束日期

**响应**
```json
{
  "code": 200,
  "message": "获取入库记录成功",
  "data": {
    "total": 25,
    "items": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "inventoryId": "550e8400-e29b-41d4-a716-446655440000",
        "inventoryName": "一次性口罩",
        "quantity": 50,
        "type": "purchase",
        "operator": "张医生",
        "productionDate": "2023-01-01T00:00:00.000Z",
        "expirationDate": "2025-01-01T00:00:00.000Z",
        "remarks": "月度补货",
        "createdAt": "2023-04-15T09:30:00.000Z"
      },
      // 更多记录...
    ]
  }
}
```

### 创建入库记录
创建新的入库记录，并增加相应物品的库存数量。

**请求**
- 方法: `POST`
- 接口: `/api/dental/inventory/in-records`
- 请求体:
```json
{
  "inventoryId": "550e8400-e29b-41d4-a716-446655440001",
  "quantity": 20,
  "type": "purchase",
  "productionDate": "2023-05-01",
  "expirationDate": "2025-05-01",
  "operator": "王管理员",
  "remarks": "季度补货"
}
```

**响应**
```json
{
  "code": 201,
  "message": "创建入库记录成功",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440003",
    "inventoryId": "550e8400-e29b-41d4-a716-446655440001",
    "quantity": 20,
    "type": "purchase",
    "productionDate": "2023-05-01T00:00:00.000Z",
    "expirationDate": "2025-05-01T00:00:00.000Z",
    "operator": "王管理员",
    "remarks": "季度补货",
    "createdAt": "2023-06-05T11:20:00.000Z"
  }
}
```

### 删除入库记录
删除指定的入库记录，并相应减少库存数量。

**请求**
- 方法: `DELETE`
- 接口: `/api/dental/inventory/in-records/:id`
- 路径参数:
  - `id`: 入库记录ID

**响应**
```json
{
  "code": 200,
  "message": "删除入库记录成功"
}
```

## 出库记录管理

### 获取出库记录列表
获取所有出库记录的分页列表。

**请求**
- 方法: `GET`
- 接口: `/api/dental/inventory/records/out/list`
- 查询参数:
  - `page`: 页码（默认: 1）
  - `pageSize`: 每页数量（默认: 10）
  - `inventoryId`: 按库存物品ID筛选
  - `startDate`: 开始日期
  - `endDate`: 结束日期

**响应**
```json
{
  "code": 200,
  "message": "获取出库记录成功",
  "data": {
    "total": 18,
    "items": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440001",
        "inventoryId": "550e8400-e29b-41d4-a716-446655440000",
        "inventoryName": "一次性口罩",
        "quantity": 10,
        "type": "use",
        "operator": "李护士",
        "department": "儿科",
        "remarks": "日常使用",
        "createdAt": "2023-04-28T14:20:00.000Z"
      },
      // 更多记录...
    ]
  }
}
```

### 创建出库记录
创建新的出库记录，并减少相应物品的库存数量。

**请求**
- 方法: `POST`
- 接口: `/api/dental/inventory/out-records`
- 请求体:
```json
{
  "inventoryId": "550e8400-e29b-41d4-a716-446655440001",
  "quantity": 5,
  "type": "use",
  "operator": "刘医生",
  "department": "成人科",
  "remarks": "治疗使用"
}
```

**响应**
```json
{
  "code": 201,
  "message": "创建出库记录成功",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "inventoryId": "550e8400-e29b-41d4-a716-446655440001",
    "quantity": 5,
    "type": "use",
    "operator": "刘医生",
    "department": "成人科",
    "remarks": "治疗使用",
    "createdAt": "2023-06-10T09:45:00.000Z"
  }
}
```

### 删除出库记录
删除指定的出库记录，并相应增加库存数量。

**请求**
- 方法: `DELETE`
- 接口: `/api/dental/inventory/out-records/:id`
- 路径参数:
  - `id`: 出库记录ID

**响应**
```json
{
  "code": 200,
  "message": "删除出库记录成功"
}
```

## 库存统计

### 获取库存统计信息
获取库存总体统计数据，包括库存总数、低库存提醒等。

**请求**
- 方法: `GET`
- 接口: `/api/dental/inventory/stats`

**响应**
```json
{
  "code": 200,
  "message": "获取库存统计成功",
  "data": {
    "totalItems": 125,
    "lowStockItems": 8,
    "outOfStockItems": 2,
    "categoryDistribution": [
      {
        "category": "耗材",
        "count": 35
      },
      {
        "category": "药品",
        "count": 42
      },
      {
        "category": "器械",
        "count": 28
      },
      {
        "category": "其他",
        "count": 20
      }
    ],
    "recentMovements": {
      "inRecords": 15,
      "outRecords": 22,
      "lastMovementDate": "2023-06-10T09:45:00.000Z"
    }
  }
}
```

## 批量导入

### 批量导入库存
通过CSV文件批量导入库存物品。

**请求**
- 方法: `POST`
- 接口: `/api/dental/inventory/batch-import`
- 格式: `multipart/form-data`
- 参数:
  - `file`: CSV文件

**响应**
```json
{
  "code": 200,
  "message": "批量导入成功",
  "data": {
    "totalProcessed": 50,
    "successCount": 48,
    "failureCount": 2,
    "failures": [
      {
        "row": 5,
        "reason": "物品编码已存在"
      },
      {
        "row": 12,
        "reason": "无效的物品类型"
      }
    ]
  }
}
```

## 低库存预警

### 获取低库存物品列表
获取当前库存低于安全库存线的物品列表。

**请求**
- 方法: `GET`
- 接口: `/api/dental/inventory/low-stock`

**响应**
```json
{
  "code": 200,
  "message": "获取低库存物品成功",
  "data": {
    "total": 8,
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "根管治疗针",
        "code": "ENDO001",
        "quantity": 5,
        "safetyQuantity": 10,
        "shortage": 5,
        "unit": "包",
        "lastInboundDate": "2023-03-15T10:30:00.000Z"
      },
      // 更多物品...
    ]
  }
}
```

## 数据模型

### 库存物品
```typescript
interface 库存物品 {
  id: string;
  name: string;             // 物品名称
  code: string;             // 物品编码
  type: string;             // 物品类型：耗材、药品、器械等
  specification: string;    // 规格
  unit: string;             // 单位
  quantity: number;         // 当前数量
  safetyQuantity: number;   // 安全库存量
  status: string;           // 状态：正常、低库存、缺货
  remarks?: string;         // 备注
  createdAt: string;        // 创建时间
  updatedAt: string;        // 更新时间
  deleteTime?: string;      // 删除时间（软删除）
}
```

### 入库记录
```typescript
interface 入库记录 {
  id: string;
  inventoryId: string;      // 关联库存ID
  inventoryName?: string;   // 物品名称（响应中包含）
  quantity: number;         // 入库数量
  type: string;             // 入库类型：采购、退货、调拨等
  productionDate?: string;  // 生产日期
  expirationDate?: string;  // 有效期
  operator: string;         // 操作员
  remarks?: string;         // 备注
  createdAt: string;        // 创建时间
  deleteTime?: string;      // 删除时间（软删除）
}
```

### 出库记录
```typescript
interface 出库记录 {
  id: string;
  inventoryId: string;      // 关联库存ID
  inventoryName?: string;   // 物品名称（响应中包含）
  quantity: number;         // 出库数量
  type: string;             // 出库类型：使用、报损、调拨等
  operator: string;         // 操作员
  department?: string;      // 使用部门
  remarks?: string;         // 备注
  createdAt: string;        // 创建时间
  deleteTime?: string;      // 删除时间（软删除）
}
```

## 错误响应

### 无效请求
```json
{
  "code": 400,
  "message": "无效的请求参数",
  "errors": [
    {
      "field": "quantity",
      "message": "数量必须大于0"
    }
  ]
}
```

### 资源未找到
```json
{
  "code": 404,
  "message": "未找到库存物品"
}
```

### 业务逻辑错误
```json
{
  "code": 400,
  "message": "库存不足，无法出库",
  "data": {
    "currentQuantity": 5,
    "requestedQuantity": 10
  }
}
```

### 服务器错误
```json
{
  "code": 500,
  "message": "处理请求失败",
  "error": "服务器内部错误"
}
```

## 状态码

| 状态码 | 描述 |
|------|------|
| 200  | 成功 - 请求处理成功 |
| 201  | 已创建 - 资源创建成功 |
| 400  | 错误请求 - 无效参数或业务逻辑错误 |
| 404  | 未找到 - 资源不存在 |
| 500  | 服务器错误 - 服务器处理异常 |

## 业务流程

1. **物品入库**：通过创建入库记录，系统自动增加相应物品的库存数量。
2. **物品出库**：通过创建出库记录，系统自动减少相应物品的库存数量。
3. **库存监控**：系统自动监控库存水平，当库存低于安全库存线时发出警告。
4. **库存盘点**：定期进行库存盘点，核对实际库存与系统记录，调整差异。
5. **库存分析**：通过统计数据分析库存使用趋势，优化库存管理。 