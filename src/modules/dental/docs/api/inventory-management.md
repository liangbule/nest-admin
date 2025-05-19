# 库存管理 API 文档

## 概述
本文档详细描述了牙科诊所库存管理系统的 API 接口，包括库存管理、库存盘点和库存统计等功能。

## 基础信息
- **Base URL**: `/api/dental`
- **认证方式**: Bearer Token (JWT)
- **请求头**: 
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  ```

## 库存管理

### 1. 获取库存列表
获取所有库存物品的分页列表。

**请求**:
- **方法**: GET
- **路径**: `/dental/inventory`
- **查询参数**:
  - `page`: 页码 (默认: 1)
  - `pageSize`: 每页条数 (默认: 10)
  - `name`: 按物品名称筛选（可选）
  - `category`: 按分类筛选（可选）
  - `lowStock`: 仅显示低库存物品 (布尔值，可选)

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "物品名称",
        "category": "物品分类",
        "sku": "库存编码",
        "specification": "规格",
        "unit": "单位",
        "quantity": 100,
        "minQuantity": 10,
        "maxQuantity": 200,
        "price": 25.5,
        "location": "储存位置",
        "expiryDate": "YYYY-MM-DD",
        "createdAt": "YYYY-MM-DDTHH:MM:SS.sssZ",
        "updatedAt": "YYYY-MM-DDTHH:MM:SS.sssZ"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

### 2. 获取库存详情
获取特定库存物品的详细信息。

**请求**:
- **方法**: GET
- **路径**: `/dental/inventory/{id}`

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "物品名称",
    "category": "物品分类",
    "sku": "库存编码",
    "specification": "规格",
    "unit": "单位",
    "quantity": 100,
    "minQuantity": 10,
    "maxQuantity": 200,
    "price": 25.5,
    "location": "储存位置",
    "expiryDate": "YYYY-MM-DD",
    "createdAt": "YYYY-MM-DDTHH:MM:SS.sssZ",
    "updatedAt": "YYYY-MM-DDTHH:MM:SS.sssZ"
  }
}
```

### 3. 创建库存物品
创建新的库存物品记录。

**请求**:
- **方法**: POST
- **路径**: `/dental/inventory`
- **请求体**:
```json
{
  "name": "物品名称",
  "category": "物品分类",
  "sku": "库存编码",
  "specification": "规格",
  "unit": "单位",
  "quantity": 100,
  "minQuantity": 10,
  "maxQuantity": 200,
  "price": 25.5,
  "location": "储存位置",
  "expiryDate": "YYYY-MM-DD"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "物品名称",
    "category": "物品分类",
    "sku": "库存编码",
    "specification": "规格",
    "unit": "单位",
    "quantity": 100,
    "minQuantity": 10,
    "maxQuantity": 200,
    "price": 25.5,
    "location": "储存位置",
    "expiryDate": "YYYY-MM-DD",
    "createdAt": "YYYY-MM-DDTHH:MM:SS.sssZ",
    "updatedAt": "YYYY-MM-DDTHH:MM:SS.sssZ"
  }
}
```

### 4. 更新库存物品
更新现有库存物品的信息。

**请求**:
- **方法**: PUT
- **路径**: `/dental/inventory/{id}`
- **请求体** (只需包含要更新的字段):
```json
{
  "quantity": 120,
  "price": 26.5,
  "minQuantity": 15
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "物品名称",
    "category": "物品分类",
    "sku": "库存编码",
    "specification": "规格",
    "unit": "单位",
    "quantity": 120,
    "minQuantity": 15,
    "maxQuantity": 200,
    "price": 26.5,
    "location": "储存位置",
    "expiryDate": "YYYY-MM-DD",
    "createdAt": "YYYY-MM-DDTHH:MM:SS.sssZ",
    "updatedAt": "YYYY-MM-DDTHH:MM:SS.sssZ"
  }
}
```

### 5. 删除库存物品
删除特定的库存物品记录。

**请求**:
- **方法**: DELETE
- **路径**: `/dental/inventory/{id}`

**响应**:
```json
{
  "success": true,
  "message": "库存物品已成功删除"
}
```

## 库存盘点

### 1. 获取盘点记录列表
获取库存盘点记录的分页列表。

**请求**:
- **方法**: GET
- **路径**: `/dental/inventory/stock-takes`
- **查询参数**:
  - `page`: 页码 (默认: 1)
  - `pageSize`: 每页条数 (默认: 10)
  - `startDate`: 开始日期筛选 (YYYY-MM-DD，可选)
  - `endDate`: 结束日期筛选 (YYYY-MM-DD，可选)
  - `operator`: 按操作员筛选 (可选)
  - `batchNumber`: 按批次号筛选 (可选)

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "batchNumber": "盘点批次号",
        "stockTakeDate": "YYYY-MM-DD",
        "operator": "操作员姓名",
        "remarks": "盘点备注",
        "resultSummary": {
          "totalItems": 50,
          "matchItems": 45,
          "diffItems": 5,
          "totalDiff": -8
        },
        "createdAt": "YYYY-MM-DDTHH:MM:SS.sssZ",
        "updatedAt": "YYYY-MM-DDTHH:MM:SS.sssZ"
      }
    ],
    "total": 20,
    "page": 1,
    "pageSize": 10
  }
}
```

### 2. 获取盘点记录详情
获取特定盘点记录的详细信息，包括每个盘点物品的明细。

**请求**:
- **方法**: GET
- **路径**: `/dental/inventory/stock-takes/{id}`

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "batchNumber": "盘点批次号",
    "stockTakeDate": "YYYY-MM-DD",
    "operator": "操作员姓名",
    "remarks": "盘点备注",
    "resultSummary": {
      "totalItems": 50,
      "matchItems": 45,
      "diffItems": 5,
      "totalDiff": -8
    },
    "items": [
      {
        "id": "uuid",
        "inventoryId": "库存物品ID",
        "inventoryName": "物品名称",
        "systemQuantity": 100,
        "actualQuantity": 98,
        "difference": -2,
        "reason": "物品丢失"
      }
    ],
    "createdAt": "YYYY-MM-DDTHH:MM:SS.sssZ",
    "updatedAt": "YYYY-MM-DDTHH:MM:SS.sssZ"
  }
}
```

### 3. 创建盘点记录
创建新的库存盘点记录。

**请求**:
- **方法**: POST
- **路径**: `/dental/inventory/stock-takes`
- **请求体**:
```json
{
  "batchNumber": "盘点批次号",
  "stockTakeDate": "YYYY-MM-DD",
  "operator": "操作员姓名",
  "remarks": "盘点备注",
  "items": [
    {
      "inventoryId": "库存物品ID",
      "actualQuantity": 98,
      "reason": "物品丢失"
    }
  ]
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "batchNumber": "盘点批次号",
    "stockTakeDate": "YYYY-MM-DD",
    "operator": "操作员姓名",
    "remarks": "盘点备注",
    "resultSummary": {
      "totalItems": 1,
      "matchItems": 0,
      "diffItems": 1,
      "totalDiff": -2
    },
    "items": [
      {
        "id": "uuid",
        "inventoryId": "库存物品ID",
        "inventoryName": "物品名称",
        "systemQuantity": 100,
        "actualQuantity": 98,
        "difference": -2,
        "reason": "物品丢失"
      }
    ],
    "createdAt": "YYYY-MM-DDTHH:MM:SS.sssZ",
    "updatedAt": "YYYY-MM-DDTHH:MM:SS.sssZ"
  }
}
```

### 4. 删除盘点记录
删除特定的盘点记录。

**请求**:
- **方法**: DELETE
- **路径**: `/dental/inventory/stock-takes/{id}`

**响应**:
```json
{
  "success": true,
  "message": "盘点记录已成功删除"
}
```

## 库存统计

### 1. 获取库存统计数据
获取库存统计数据，包括库存预警、低库存物品等信息。

**请求**:
- **方法**: GET
- **路径**: `/dental/inventory/stats`

**响应**:
```json
{
  "success": true,
  "data": {
    "totalItems": 200,
    "lowStockItems": 15,
    "expiringItems": 8,
    "categories": [
      {
        "name": "药品",
        "count": 80
      },
      {
        "name": "耗材",
        "count": 120
      }
    ],
    "topLowStock": [
      {
        "id": "uuid",
        "name": "物品名称",
        "category": "物品分类",
        "quantity": 5,
        "minQuantity": 10,
        "status": "紧急"
      }
    ]
  }
}
```

## 错误处理
所有API在发生错误时将返回适当的HTTP状态码和JSON格式的错误信息：

```json
{
  "success": false,
  "message": "错误描述",
  "error": "错误类型",
  "statusCode": 400
}
```

常见错误状态码：
- `400` - 请求参数错误
- `401` - 未授权（无效的认证令牌）
- `404` - 资源不存在
- `500` - 服务器内部错误 