# 库存盘点 API 文档

## 概述
库存盘点API提供了对牙科诊所物资进行实物盘点的管理功能，用于核对系统库存与实际库存的差异，并进行相应调整。

## 盘点操作

### 获取盘点记录列表
获取盘点记录的分页列表，支持多种筛选条件。

**请求**
- 方法: `GET`
- 接口: `/api/dental/inventory/stock-takes`
- 查询参数:
  - `page`: 页码（默认: 1）
  - `pageSize`: 每页数量（默认: 10）
  - `startDate`: 按开始日期筛选（YYYY-MM-DD）
  - `endDate`: 按结束日期筛选（YYYY-MM-DD）
  - `operator`: 按操作员筛选
  - `batchNumber`: 按批次号筛选

**响应**
```json
{
  "code": 200,
  "message": "获取盘点记录成功",
  "data": {
    "total": 5,
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "batchNumber": "ST-2023-001",
        "stockTakeDate": "2023-05-01T09:30:00.000Z",
        "operator": "张医生",
        "remarks": "月度例行盘点",
        "resultSummary": {
          "totalItems": 10,
          "matchedItems": 7,
          "discrepancyItems": 3,
          "surplusItems": 1,
          "shortageItems": 2
        },
        "createdAt": "2023-05-01T09:30:00.000Z",
        "updatedAt": "2023-05-01T11:45:00.000Z"
      },
      // 更多盘点记录...
    ]
  }
}
```

### 获取盘点详情
根据ID获取特定盘点记录的详细信息，包括所有盘点项目。

**请求**
- 方法: `GET`
- 接口: `/api/dental/inventory/stock-takes/:id`
- 路径参数:
  - `id`: 盘点记录ID

**响应**
```json
{
  "code": 200,
  "message": "获取盘点详情成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "batchNumber": "ST-2023-001",
    "stockTakeDate": "2023-05-01T09:30:00.000Z",
    "operator": "张医生",
    "remarks": "月度例行盘点",
    "resultSummary": {
      "totalItems": 10,
      "matchedItems": 7,
      "discrepancyItems": 3,
      "surplusItems": 1,
      "shortageItems": 2
    },
    "items": [
      {
        "id": "5a0e8400-e29b-41d4-a716-446655440000",
        "inventoryId": "150e8400-e29b-41d4-a716-446655440000",
        "inventoryName": "一次性手套",
        "systemQuantity": 100,
        "actualQuantity": 98,
        "difference": -2,
        "reason": "使用未记录"
      },
      {
        "id": "5a0e8400-e29b-41d4-a716-446655440001",
        "inventoryId": "150e8400-e29b-41d4-a716-446655440001",
        "inventoryName": "口罩",
        "systemQuantity": 50,
        "actualQuantity": 51,
        "difference": 1,
        "reason": "上次盘点计数错误"
      },
      // 更多盘点项目...
    ],
    "createdAt": "2023-05-01T09:30:00.000Z",
    "updatedAt": "2023-05-01T11:45:00.000Z"
  }
}
```

### 创建盘点记录
创建新的盘点记录及其项目。

**请求**
- 方法: `POST`
- 接口: `/api/dental/inventory/stock-takes`
- 请求体:
```json
{
  "batchNumber": "ST-2023-002",
  "stockTakeDate": "2023-06-01T10:00:00.000Z",
  "operator": "李护士",
  "remarks": "季度盘点",
  "items": [
    {
      "inventoryId": "150e8400-e29b-41d4-a716-446655440000",
      "actualQuantity": 95,
      "reason": "部分包装缺失标签"
    },
    {
      "inventoryId": "150e8400-e29b-41d4-a716-446655440001",
      "actualQuantity": 48,
      "reason": "使用未记录"
    },
    {
      "inventoryId": "150e8400-e29b-41d4-a716-446655440002",
      "actualQuantity": 25,
      "reason": ""
    }
  ]
}
```

**响应**
```json
{
  "code": 201,
  "message": "创建盘点记录成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "batchNumber": "ST-2023-002",
    "stockTakeDate": "2023-06-01T10:00:00.000Z",
    "operator": "李护士",
    "remarks": "季度盘点",
    "resultSummary": {
      "totalItems": 3,
      "matchedItems": 1,
      "discrepancyItems": 2,
      "surplusItems": 0,
      "shortageItems": 2
    },
    "items": [
      {
        "id": "5a0e8400-e29b-41d4-a716-446655440003",
        "inventoryId": "150e8400-e29b-41d4-a716-446655440000",
        "inventoryName": "一次性手套",
        "systemQuantity": 98,
        "actualQuantity": 95,
        "difference": -3,
        "reason": "部分包装缺失标签"
      },
      {
        "id": "5a0e8400-e29b-41d4-a716-446655440004",
        "inventoryId": "150e8400-e29b-41d4-a716-446655440001",
        "inventoryName": "口罩",
        "systemQuantity": 51,
        "actualQuantity": 48,
        "difference": -3,
        "reason": "使用未记录"
      },
      {
        "id": "5a0e8400-e29b-41d4-a716-446655440005",
        "inventoryId": "150e8400-e29b-41d4-a716-446655440002",
        "inventoryName": "牙线",
        "systemQuantity": 25,
        "actualQuantity": 25,
        "difference": 0,
        "reason": ""
      }
    ],
    "createdAt": "2023-06-01T10:15:00.000Z",
    "updatedAt": "2023-06-01T10:15:00.000Z"
  }
}
```

### 删除盘点记录
删除指定的盘点记录。

**请求**
- 方法: `DELETE`
- 接口: `/api/dental/inventory/stock-takes/:id`
- 路径参数:
  - `id`: 盘点记录ID

**响应**
```json
{
  "code": 200,
  "message": "盘点记录删除成功"
}
```

## 库存统计与盘点信息

### 获取库存统计
获取库存统计信息，包括最近盘点的相关数据。

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
    "recentStocktakes": {
      "total": 5,
      "lastStocktakeDate": "2023-06-01T10:00:00.000Z",
      "discrepanciesByMonth": [
        {
          "month": "2023年5月",
          "discrepancies": 3
        },
        {
          "month": "2023年6月",
          "discrepancies": 2
        }
      ]
    }
  }
}
```

## 数据模型

### 盘点记录
```typescript
interface 盘点记录 {
  id: string;
  batchNumber: string;         // 批次号
  stockTakeDate: string;       // 盘点日期（ISO日期字符串）
  operator: string;            // 操作员
  remarks?: string;            // 备注
  resultSummary: {             // 结果摘要
    totalItems: number;        // 总项目数
    matchedItems: number;      // 匹配项目数
    discrepancyItems: number;  // 差异项目数
    surplusItems: number;      // 盈余项目数
    shortageItems: number;     // 短缺项目数
  };
  items?: 盘点项目[];          // 盘点项目列表
  createdAt: string;           // 创建时间（ISO日期字符串）
  updatedAt: string;           // 更新时间（ISO日期字符串）
  deleteTime?: string;         // 删除时间（ISO日期字符串，用于软删除）
}
```

### 盘点项目
```typescript
interface 盘点项目 {
  id: string;
  stockTakeId: string;         // 关联盘点记录ID
  inventoryId: string;         // 关联库存ID
  inventoryName?: string;      // 物品名称（响应中包含）
  systemQuantity: number;      // 系统数量
  actualQuantity: number;      // 实际数量
  difference: number;          // 差异（计算为实际数量-系统数量）
  reason?: string;             // 差异原因
  createdAt?: string;          // 创建时间（ISO日期字符串）
  updatedAt?: string;          // 更新时间（ISO日期字符串）
  deleteTime?: string;         // 删除时间（ISO日期字符串，用于软删除）
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
      "field": "stockTakeDate",
      "message": "盘点日期为必填项"
    },
    {
      "field": "items",
      "message": "盘点至少需要一个项目"
    }
  ]
}
```

### 资源未找到
```json
{
  "code": 404,
  "message": "未找到盘点记录"
}
```

### 库存物品未找到
```json
{
  "code": 404,
  "message": "一个或多个库存物品未找到",
  "errors": [
    {
      "field": "items[0].inventoryId",
      "message": "ID为150e8400-e29b-41d4-a716-446655440099的库存物品未找到"
    }
  ]
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
| 400  | 错误请求 - 无效参数 |
| 404  | 未找到 - 资源不存在 |
| 500  | 服务器错误 - 服务器处理异常 |

## 业务流程

1. **实物盘点**：操作员物理清点库存物品数量。
2. **创建盘点记录**：使用实际盘点的数量创建盘点记录。
3. **系统比对**：系统比较实际数量与系统数量，计算差异。
4. **库存调整**：如发现差异，可能会更新库存数量以匹配实际数量。
5. **生成报告**：生成盘点摘要，用于审核和记录保存。 