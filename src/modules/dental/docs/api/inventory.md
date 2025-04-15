# 库存管理API文档

本文档详细描述了牙科诊所管理系统中库存管理模块的API接口。这些接口用于管理诊所的医疗用品、药品等库存。

## 1. 库存列表

获取库存物品列表，支持分页和筛选。

### 请求

```
GET /api/dental/inventory
```

### 查询参数

| 参数名 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认为1 |
| pageSize | number | 否 | 每页条数，默认为10 |
| name | string | 否 | 物品名称过滤 |
| type | string | 否 | 物品类型过滤 |
| lowStock | boolean | 否 | 是否只显示低库存物品 |

### 响应

```json
{
  "code": 200,
  "message": "获取库存列表成功",
  "data": {
    "total": 100,
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "医用口罩",
        "type": "consumable",
        "specification": "50个/盒",
        "unit": "盒",
        "batchNumber": "BN20240601",
        "expiryDate": "2025-06-01",
        "quantity": 20,
        "lowStockThreshold": 5,
        "purchasePrice": 50.00,
        "sellingPrice": 88.00,
        "manufacturer": "某医疗用品有限公司",
        "supplier": "某医疗供应商",
        "remark": "普通防护用品",
        "createdAt": "2024-01-01T08:00:00Z",
        "updatedAt": "2024-01-02T09:30:00Z"
      },
      // ... 更多物品
    ]
  }
}
```

## 2. 库存详情

获取单个库存物品的详细信息。

### 请求

```
GET /api/dental/inventory/:id
```

### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 库存物品ID |

### 响应

```json
{
  "code": 200,
  "message": "获取库存详情成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "医用口罩",
    "type": "consumable",
    "specification": "50个/盒",
    "unit": "盒",
    "batchNumber": "BN20240601",
    "expiryDate": "2025-06-01",
    "quantity": 20,
    "lowStockThreshold": 5,
    "purchasePrice": 50.00,
    "sellingPrice": 88.00,
    "manufacturer": "某医疗用品有限公司",
    "supplier": "某医疗供应商",
    "remark": "普通防护用品",
    "createdAt": "2024-01-01T08:00:00Z",
    "updatedAt": "2024-01-02T09:30:00Z",
    "stockMovements": [
      {
        "id": "660f9500-e29b-41d4-a716-446655440001",
        "type": "in",
        "quantity": 10,
        "date": "2024-01-01T08:00:00Z",
        "operator": "张医生",
        "remark": "采购入库"
      },
      // ... 更多库存变动记录
    ]
  }
}
```

## 3. 创建库存

创建新的库存物品。

### 请求

```
POST /api/dental/inventory
```

### 请求体

```json
{
  "name": "牙科填充材料",
  "type": "material",
  "specification": "20g/瓶",
  "unit": "瓶",
  "batchNumber": "BN20240501",
  "expiryDate": "2026-05-01",
  "quantity": 15,
  "lowStockThreshold": 3,
  "purchasePrice": 120.00,
  "sellingPrice": 200.00,
  "manufacturer": "某牙科材料厂商",
  "supplier": "某牙科供应商",
  "remark": "高质量填充材料"
}
```

### 响应

```json
{
  "code": 201,
  "message": "创建库存成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "牙科填充材料",
    "type": "material",
    "specification": "20g/瓶",
    "unit": "瓶",
    "batchNumber": "BN20240501",
    "expiryDate": "2026-05-01",
    "quantity": 15,
    "lowStockThreshold": 3,
    "purchasePrice": 120.00,
    "sellingPrice": 200.00,
    "manufacturer": "某牙科材料厂商",
    "supplier": "某牙科供应商",
    "remark": "高质量填充材料",
    "createdAt": "2024-06-01T10:00:00Z",
    "updatedAt": "2024-06-01T10:00:00Z"
  }
}
```

## 4. 更新库存

更新库存物品信息。

### 请求

```
PUT /api/dental/inventory/:id
```

### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 库存物品ID |

### 请求体

```json
{
  "name": "牙科填充材料",
  "specification": "20g/瓶",
  "lowStockThreshold": 5,
  "sellingPrice": 220.00,
  "remark": "高质量填充材料，新增用法说明"
}
```

### 响应

```json
{
  "code": 200,
  "message": "更新库存成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "牙科填充材料",
    "type": "material",
    "specification": "20g/瓶",
    "unit": "瓶",
    "batchNumber": "BN20240501",
    "expiryDate": "2026-05-01",
    "quantity": 15,
    "lowStockThreshold": 5,
    "purchasePrice": 120.00,
    "sellingPrice": 220.00,
    "manufacturer": "某牙科材料厂商",
    "supplier": "某牙科供应商",
    "remark": "高质量填充材料，新增用法说明",
    "createdAt": "2024-06-01T10:00:00Z",
    "updatedAt": "2024-06-02T09:15:00Z"
  }
}
```

## 5. 删除库存

删除库存物品（软删除）。

### 请求

```
DELETE /api/dental/inventory/:id
```

### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 库存物品ID |

### 响应

```json
{
  "code": 200,
  "message": "删除库存成功",
  "data": null
}
```

## 6. 库存入库记录

创建入库记录，增加库存数量。

### 请求

```
POST /api/dental/inventory/in-records
```

### 请求体

```json
{
  "items": [
    {
      "inventoryId": "550e8400-e29b-41d4-a716-446655440000",
      "quantity": 10,
      "batchNumber": "BN20240601",
      "expiryDate": "2025-06-01",
      "purchasePrice": 50.00
    },
    {
      "inventoryId": "550e8400-e29b-41d4-a716-446655440001",
      "quantity": 5,
      "batchNumber": "BN20240501",
      "expiryDate": "2026-05-01",
      "purchasePrice": 120.00
    }
  ],
  "operator": "张医生",
  "date": "2024-06-05T09:00:00Z",
  "supplier": "某医疗供应商",
  "remark": "月度采购入库"
}
```

### 响应

```json
{
  "code": 201,
  "message": "创建入库记录成功",
  "data": {
    "id": "660f9500-e29b-41d4-a716-446655440002",
    "date": "2024-06-05T09:00:00Z",
    "operator": "张医生",
    "supplier": "某医疗供应商",
    "remark": "月度采购入库",
    "items": [
      {
        "inventoryId": "550e8400-e29b-41d4-a716-446655440000",
        "name": "医用口罩",
        "quantity": 10,
        "batchNumber": "BN20240601",
        "expiryDate": "2025-06-01",
        "purchasePrice": 50.00
      },
      {
        "inventoryId": "550e8400-e29b-41d4-a716-446655440001",
        "name": "牙科填充材料",
        "quantity": 5,
        "batchNumber": "BN20240501",
        "expiryDate": "2026-05-01",
        "purchasePrice": 120.00
      }
    ],
    "createdAt": "2024-06-05T09:00:00Z"
  }
}
```

## 7. 库存出库记录

创建出库记录，减少库存数量。

### 请求

```
POST /api/dental/inventory/out-records
```

### 请求体

```json
{
  "items": [
    {
      "inventoryId": "550e8400-e29b-41d4-a716-446655440000",
      "quantity": 2,
      "batchNumber": "BN20240601"
    },
    {
      "inventoryId": "550e8400-e29b-41d4-a716-446655440001",
      "quantity": 1,
      "batchNumber": "BN20240501"
    }
  ],
  "operator": "李护士",
  "date": "2024-06-06T14:30:00Z",
  "usage": "patient",
  "patientId": "770g0600-e29b-41d4-a716-446655440003",
  "remark": "患者治疗使用"
}
```

### 响应

```json
{
  "code": 201,
  "message": "创建出库记录成功",
  "data": {
    "id": "660f9500-e29b-41d4-a716-446655440003",
    "date": "2024-06-06T14:30:00Z",
    "operator": "李护士",
    "usage": "patient",
    "patientId": "770g0600-e29b-41d4-a716-446655440003",
    "remark": "患者治疗使用",
    "items": [
      {
        "inventoryId": "550e8400-e29b-41d4-a716-446655440000",
        "name": "医用口罩",
        "quantity": 2,
        "batchNumber": "BN20240601"
      },
      {
        "inventoryId": "550e8400-e29b-41d4-a716-446655440001",
        "name": "牙科填充材料",
        "quantity": 1,
        "batchNumber": "BN20240501"
      }
    ],
    "createdAt": "2024-06-06T14:30:00Z"
  }
}
```

## 8. 库存盘点

创建库存盘点记录。

### 请求

```
POST /api/dental/inventory/stock-takes
```

### 请求体

```json
{
  "batchNumber": "ST20240610",
  "stockTakeDate": "2024-06-10T10:00:00Z",
  "operator": "王经理",
  "remarks": "月度库存盘点",
  "items": [
    {
      "inventoryId": "550e8400-e29b-41d4-a716-446655440000",
      "actualQuantity": 18,
      "reason": "2个已损坏"
    },
    {
      "inventoryId": "550e8400-e29b-41d4-a716-446655440001",
      "actualQuantity": 19,
      "reason": ""
    }
  ]
}
```

### 响应

```json
{
  "code": 201,
  "message": "创建库存盘点成功",
  "data": {
    "id": "880h0700-e29b-41d4-a716-446655440004",
    "batchNumber": "ST20240610",
    "stockTakeDate": "2024-06-10T10:00:00Z",
    "operator": "王经理",
    "remarks": "月度库存盘点",
    "resultSummary": {
      "totalItems": 2,
      "matchedItems": 1,
      "discrepancyItems": 1,
      "totalDiscrepancy": -2
    },
    "items": [
      {
        "inventoryId": "550e8400-e29b-41d4-a716-446655440000",
        "name": "医用口罩",
        "systemQuantity": 20,
        "actualQuantity": 18,
        "difference": -2,
        "reason": "2个已损坏"
      },
      {
        "inventoryId": "550e8400-e29b-41d4-a716-446655440001",
        "name": "牙科填充材料",
        "systemQuantity": 19,
        "actualQuantity": 19,
        "difference": 0,
        "reason": ""
      }
    ],
    "createdAt": "2024-06-10T10:00:00Z"
  }
}
```

## 9. 库存盘点列表

获取库存盘点记录列表。

### 请求

```
GET /api/dental/inventory/stock-takes
```

### 查询参数

| 参数名 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认为1 |
| pageSize | number | 否 | 每页条数，默认为10 |
| startDate | string | 否 | 开始日期 |
| endDate | string | 否 | 结束日期 |
| operator | string | 否 | 操作员过滤 |
| batchNumber | string | 否 | 批次号过滤 |

### 响应

```json
{
  "code": 200,
  "message": "获取盘点记录列表成功",
  "data": {
    "total": 10,
    "items": [
      {
        "id": "880h0700-e29b-41d4-a716-446655440004",
        "batchNumber": "ST20240610",
        "stockTakeDate": "2024-06-10T10:00:00Z",
        "operator": "王经理",
        "remarks": "月度库存盘点",
        "resultSummary": {
          "totalItems": 2,
          "matchedItems": 1,
          "discrepancyItems": 1,
          "totalDiscrepancy": -2
        },
        "createdAt": "2024-06-10T10:00:00Z"
      },
      // ... 更多盘点记录
    ]
  }
}
```

## 10. 库存盘点详情

获取单个库存盘点记录的详细信息。

### 请求

```
GET /api/dental/inventory/stock-takes/:id
```

### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 盘点记录ID |

### 响应

```json
{
  "code": 200,
  "message": "获取盘点记录详情成功",
  "data": {
    "id": "880h0700-e29b-41d4-a716-446655440004",
    "batchNumber": "ST20240610",
    "stockTakeDate": "2024-06-10T10:00:00Z",
    "operator": "王经理",
    "remarks": "月度库存盘点",
    "resultSummary": {
      "totalItems": 2,
      "matchedItems": 1,
      "discrepancyItems": 1,
      "totalDiscrepancy": -2
    },
    "items": [
      {
        "id": "990i0800-e29b-41d4-a716-446655440005",
        "inventoryId": "550e8400-e29b-41d4-a716-446655440000",
        "name": "医用口罩",
        "specification": "50个/盒",
        "unit": "盒",
        "systemQuantity": 20,
        "actualQuantity": 18,
        "difference": -2,
        "reason": "2个已损坏"
      },
      {
        "id": "990i0800-e29b-41d4-a716-446655440006",
        "inventoryId": "550e8400-e29b-41d4-a716-446655440001",
        "name": "牙科填充材料",
        "specification": "20g/瓶",
        "unit": "瓶",
        "systemQuantity": 19,
        "actualQuantity": 19,
        "difference": 0,
        "reason": ""
      }
    ],
    "createdAt": "2024-06-10T10:00:00Z",
    "updatedAt": "2024-06-10T10:00:00Z"
  }
}
```

## 11. 删除库存盘点

删除库存盘点记录。

### 请求

```
DELETE /api/dental/inventory/stock-takes/:id
```

### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 盘点记录ID |

### 响应

```json
{
  "code": 200,
  "message": "删除盘点记录成功",
  "data": null
}
```

## 12. 库存统计信息

获取库存统计信息，包括低库存预警、即将过期物品等。

### 请求

```
GET /api/dental/inventory/stats
```

### 响应

```json
{
  "code": 200,
  "message": "获取库存统计信息成功",
  "data": {
    "totalItems": 50,
    "lowStockWarnings": 5,
    "expiryWarnings": 3,
    "totalValue": 25000.00,
    "recentIn": {
      "count": 10,
      "value": 5000.00
    },
    "recentOut": {
      "count": 15,
      "value": 3000.00
    },
    "mostUsed": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "医用口罩",
        "usageCount": 30
      },
      // ... 更多使用频率高的物品
    ],
    "lowStockItems": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "一次性手套",
        "quantity": 2,
        "lowStockThreshold": 5
      },
      // ... 更多低库存物品
    ],
    "expiringItems": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "name": "消毒液",
        "expiryDate": "2024-07-15",
        "daysRemaining": 15
      },
      // ... 更多即将过期物品
    ]
  }
}
```

## 错误响应

### 请求参数错误

```json
{
  "code": 400,
  "message": "请求参数错误",
  "errors": [
    {
      "field": "name",
      "message": "物品名称不能为空"
    }
  ]
}
```

### 资源不存在

```json
{
  "code": 404,
  "message": "库存物品不存在",
  "data": null
}
```

### 服务器错误

```json
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```

## 状态码说明

| 状态码 | 说明 |
|------|------|
| 200 | 操作成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 | 