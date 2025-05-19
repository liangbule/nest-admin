# API文档说明

## 概述

牙科诊所管理系统API采用RESTful风格设计，主要包含以下模块：

- 库存管理
- 库存盘点
- 患者管理
- 预约管理
- 医疗记录
- 账单管理

## API通用规范

### 基础URL

所有API均以`/api/dental`为前缀。

### 请求方法

- `GET`: 查询资源
- `POST`: 创建资源
- `PUT`: 更新资源
- `DELETE`: 删除资源

### 响应格式

所有API响应均采用JSON格式，基本结构如下：

```json
{
  "code": 200,       // 状态码
  "message": "操作成功", // 消息
  "data": {          // 数据（可选）
    // 具体数据
  },
  "errors": [        // 错误信息（仅在出错时出现）
    {
      "field": "字段名",
      "message": "错误描述"
    }
  ]
}
```

### 分页参数

支持分页的API均接受以下查询参数：

- `page`: 页码，从1开始，默认为1
- `pageSize`: 每页记录数，默认为10

分页响应格式：

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "total": 100,    // 总记录数
    "items": [       // 当前页数据
      // 数据项
    ]
  }
}
```

### 错误码

| 状态码 | 描述 |
|------|------|
| 200  | 成功 - 请求处理成功 |
| 201  | 已创建 - 资源创建成功 |
| 400  | 错误请求 - 无效参数或业务逻辑错误 |
| 401  | 未授权 - 用户未登录或token无效 |
| 403  | 禁止访问 - 用户无权限 |
| 404  | 未找到 - 请求的资源不存在 |
| 500  | 服务器错误 - 服务器内部错误 |

## 认证与授权

### 认证方式

系统采用JWT（JSON Web Token）进行用户认证。

### 获取令牌

```
POST /api/dental/auth/login
```

请求体：

```json
{
  "username": "用户名",
  "password": "密码"
}
```

响应：

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "用户ID",
      "username": "用户名",
      "role": "角色"
    }
  }
}
```

### 使用令牌

所有需要认证的API请求均需在HTTP头部包含：

```
Authorization: Bearer {token}
```

## 详细API文档

各模块的详细API文档请参阅：

- [库存管理API](./api/inventory-management-zh.md)
- [库存盘点API](./api/stocktake-management-zh.md)
- [患者管理API](./api/patient-management-zh.md)

## 附录

### 数据类型

| 类型 | 描述 | 示例 |
|------|------|------|
| string | 字符串 | "示例文本" |
| number | 数字 | 100, 99.9 |
| boolean | 布尔值 | true, false |
| date | 日期时间 | "2023-06-01T10:00:00Z" |
| uuid | 通用唯一标识符 | "550e8400-e29b-41d4-a716-446655440000" |

---

最后更新时间：2023年7月1日 