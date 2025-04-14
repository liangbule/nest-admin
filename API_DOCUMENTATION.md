# 牙科诊所管理系统 API 文档

本文档详细描述了牙科诊所管理系统的后端 API 需求，供后端开发团队参考实现。

## 基础信息

- 基础 URL: `/api`
- 所有响应格式均为 JSON
- 认证采用 JWT Token
- 响应状态码：
  - 200: 成功
  - 400: 请求错误
  - 401: 未授权
  - 403: 禁止访问
  - 404: 资源不存在
  - 500: 服务器错误

## 标准响应格式

```json
{
  "success": true/false,
  "message": "操作成功/失败原因",
  "data": { ... } // 具体数据，成功时返回
}
```

## 认证 API

### 登录

- **URL**: `/auth/login`
- **方法**: `POST`
- **描述**: 用户登录系统
- **请求体**:
  ```json
  {
    "username": "string", // 用户名
    "password": "string", // 密码
    "captcha": "string"   // 验证码（可选）
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "登录成功",
    "data": {
      "id": "string",
      "username": "string",
      "realName": "string",
      "role": "admin/doctor/staff",
      "token": "string" // JWT Token
    }
  }
  ```

### 登出

- **URL**: `/auth/logout`
- **方法**: `POST`
- **描述**: 用户登出系统
- **请求头**: 需要包含有效的 Authorization
- **响应**:
  ```json
  {
    "success": true,
    "message": "登出成功"
  }
  ```

## 用户管理 API

### 获取用户列表

- **URL**: `/users`
- **方法**: `GET`
- **描述**: 获取系统用户列表（管理员权限）
- **请求参数**:
  ```
  username: 用户名（可选，模糊查询）
  realName: 真实姓名（可选，模糊查询）
  phone: 电话号码（可选）
  role: 角色（可选，enum: admin/doctor/staff）
  status: 状态（可选，enum: active/inactive）
  page: 页码（可选，默认1）
  limit: 每页数量（可选，默认20）
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 50,
      "list": [
        {
          "id": "string",
          "username": "string",
          "realName": "string",
          "phone": "string",
          "role": "admin/doctor/staff",
          "status": "active/inactive",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
  }
  ```

### 创建用户

- **URL**: `/users`
- **方法**: `POST`
- **描述**: 创建系统用户（管理员权限）
- **请求体**:
  ```json
  {
    "username": "string",
    "password": "string",
    "realName": "string",
    "phone": "string",
    "role": "admin/doctor/staff",
    "status": "active/inactive"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "创建成功",
    "data": {
      "id": "string",
      "username": "string",
      "realName": "string",
      "phone": "string",
      "role": "admin/doctor/staff",
      "status": "active/inactive",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 更新用户

- **URL**: `/users/:id`
- **方法**: `PUT`
- **描述**: 更新系统用户（管理员权限）
- **请求体**:
  ```json
  {
    "username": "string", // 可选
    "password": "string", // 可选
    "realName": "string", // 可选
    "phone": "string",    // 可选
    "role": "admin/doctor/staff", // 可选
    "status": "active/inactive"   // 可选
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "更新成功",
    "data": {
      "id": "string",
      "username": "string",
      "realName": "string",
      "phone": "string",
      "role": "admin/doctor/staff",
      "status": "active/inactive",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 删除用户

- **URL**: `/users/:id`
- **方法**: `DELETE`
- **描述**: 删除系统用户（管理员权限）
- **响应**:
  ```json
  {
    "success": true,
    "message": "删除成功"
  }
  ```

## 患者管理 API

### 获取患者列表

- **URL**: `/patients`
- **方法**: `GET`
- **描述**: 获取患者列表
- **请求参数**:
  ```
  name: 患者姓名（可选，模糊查询）
  gender: 性别（可选，enum: male/female）
  phone: 电话号码（可选）
  status: 状态（可选，enum: active/inactive）
  page: 页码（可选，默认1）
  limit: 每页数量（可选，默认20）
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 100,
      "list": [
        {
          "id": "string",
          "name": "string",
          "gender": "male/female",
          "age": 30,
          "birthday": "YYYY-MM-DD",
          "phone": "string",
          "address": "string",
          "medicalHistory": "string",
          "status": "active/inactive",
          "lastVisit": "YYYY-MM-DD",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
  }
  ```

### 获取单个患者

- **URL**: `/patients/:id`
- **方法**: `GET`
- **描述**: 获取患者详情
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "name": "string",
      "gender": "male/female",
      "age": 30,
      "birthday": "YYYY-MM-DD",
      "phone": "string",
      "address": "string",
      "medicalHistory": "string",
      "status": "active/inactive",
      "lastVisit": "YYYY-MM-DD",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 创建患者

- **URL**: `/patients`
- **方法**: `POST`
- **描述**: 创建新患者记录
- **请求体**:
  ```json
  {
    "name": "string",
    "gender": "male/female",
    "birthday": "YYYY-MM-DD",
    "phone": "string",
    "address": "string",
    "medicalHistory": "string"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "创建成功",
    "data": {
      "id": "string",
      "name": "string",
      "gender": "male/female",
      "age": 30,
      "birthday": "YYYY-MM-DD",
      "phone": "string",
      "address": "string",
      "medicalHistory": "string",
      "status": "active",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 更新患者

- **URL**: `/patients/:id`
- **方法**: `PUT`
- **描述**: 更新患者信息
- **请求体**:
  ```json
  {
    "name": "string", // 可选
    "gender": "male/female", // 可选
    "birthday": "YYYY-MM-DD", // 可选
    "phone": "string", // 可选
    "address": "string", // 可选
    "medicalHistory": "string", // 可选
    "status": "active/inactive" // 可选
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "更新成功",
    "data": {
      "id": "string",
      "name": "string",
      "gender": "male/female",
      "age": 30,
      "birthday": "YYYY-MM-DD",
      "phone": "string",
      "address": "string",
      "medicalHistory": "string",
      "status": "active/inactive",
      "lastVisit": "YYYY-MM-DD",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 删除患者

- **URL**: `/patients/:id`
- **方法**: `DELETE`
- **描述**: 删除患者记录
- **响应**:
  ```json
  {
    "success": true,
    "message": "删除成功"
  }
  ```

## 医疗记录 API

### 获取患者医疗记录列表

- **URL**: `/patients/:patientId/records`
- **方法**: `GET`
- **描述**: 获取指定患者的医疗记录列表
- **请求参数**:
  ```
  startDate: 开始日期（可选，格式：YYYY-MM-DD）
  endDate: 结束日期（可选，格式：YYYY-MM-DD）
  status: 状态（可选，enum: completed/ongoing/scheduled）
  page: 页码（可选，默认1）
  limit: 每页数量（可选，默认20）
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 20,
      "list": [
        {
          "id": "string",
          "patientId": "string",
          "doctorId": "string",
          "doctorName": "string",
          "visitDate": "YYYY-MM-DD",
          "symptoms": "string",
          "diagnosis": "string",
          "treatment": "string",
          "prescription": "string",
          "notes": "string",
          "nextVisit": "YYYY-MM-DD",
          "status": "completed/ongoing/scheduled",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
  }
  ```

### 创建医疗记录

- **URL**: `/patients/:patientId/records`
- **方法**: `POST`
- **描述**: 创建患者医疗记录
- **请求体**:
  ```json
  {
    "doctorId": "string",
    "visitDate": "YYYY-MM-DD",
    "symptoms": "string",
    "diagnosis": "string",
    "treatment": "string",
    "prescription": "string",
    "notes": "string",
    "nextVisit": "YYYY-MM-DD",
    "status": "completed/ongoing/scheduled"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "创建成功",
    "data": {
      "id": "string",
      "patientId": "string",
      "doctorId": "string",
      "visitDate": "YYYY-MM-DD",
      "symptoms": "string",
      "diagnosis": "string",
      "treatment": "string",
      "prescription": "string",
      "notes": "string",
      "nextVisit": "YYYY-MM-DD",
      "status": "completed/ongoing/scheduled",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 更新医疗记录

- **URL**: `/records/:id`
- **方法**: `PUT`
- **描述**: 更新医疗记录
- **请求体**:
  ```json
  {
    "doctorId": "string", // 可选
    "visitDate": "YYYY-MM-DD", // 可选
    "symptoms": "string", // 可选
    "diagnosis": "string", // 可选
    "treatment": "string", // 可选
    "prescription": "string", // 可选
    "notes": "string", // 可选
    "nextVisit": "YYYY-MM-DD", // 可选
    "status": "completed/ongoing/scheduled" // 可选
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "更新成功",
    "data": {
      "id": "string",
      "patientId": "string",
      "doctorId": "string",
      "visitDate": "YYYY-MM-DD",
      "symptoms": "string",
      "diagnosis": "string",
      "treatment": "string",
      "prescription": "string",
      "notes": "string",
      "nextVisit": "YYYY-MM-DD",
      "status": "completed/ongoing/scheduled",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 删除医疗记录

- **URL**: `/records/:id`
- **方法**: `DELETE`
- **描述**: 删除医疗记录
- **响应**:
  ```json
  {
    "success": true,
    "message": "删除成功"
  }
  ```

## 预约管理 API

### 获取预约列表

- **URL**: `/appointments`
- **方法**: `GET`
- **描述**: 获取预约列表
- **请求参数**:
  ```
  doctorId: 医生ID（可选）
  patientId: 患者ID（可选）
  startDate: 开始日期（可选，格式：YYYY-MM-DD）
  endDate: 结束日期（可选，格式：YYYY-MM-DD）
  status: 状态（可选，enum: scheduled/confirmed/completed/cancelled/no_show）
  type: 类型（可选，enum: checkup/treatment/consultation/followup）
  page: 页码（可选，默认1）
  limit: 每页数量（可选，默认20）
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 30,
      "list": [
        {
          "id": "string",
          "patientId": "string",
          "patientName": "string",
          "doctorId": "string",
          "doctorName": "string",
          "date": "YYYY-MM-DD",
          "time": "HH:MM",
          "duration": 30,
          "type": "checkup/treatment/consultation/followup",
          "status": "scheduled/confirmed/completed/cancelled/no_show",
          "notes": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
  }
  ```

### 获取日期预约

- **URL**: `/appointments/date/:date`
- **方法**: `GET`
- **描述**: 获取指定日期的所有预约
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "patientId": "string",
        "patientName": "string",
        "doctorId": "string",
        "doctorName": "string",
        "date": "YYYY-MM-DD",
        "time": "HH:MM",
        "duration": 30,
        "type": "checkup/treatment/consultation/followup",
        "status": "scheduled/confirmed/completed/cancelled/no_show",
        "notes": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
  ```

### 创建预约

- **URL**: `/appointments`
- **方法**: `POST`
- **描述**: 创建新预约
- **请求体**:
  ```json
  {
    "patientId": "string",
    "doctorId": "string",
    "date": "YYYY-MM-DD",
    "time": "HH:MM",
    "duration": 30,
    "type": "checkup/treatment/consultation/followup",
    "notes": "string"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "预约创建成功",
    "data": {
      "id": "string",
      "patientId": "string",
      "patientName": "string",
      "doctorId": "string",
      "doctorName": "string",
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "duration": 30,
      "type": "checkup/treatment/consultation/followup",
      "status": "scheduled",
      "notes": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 更新预约

- **URL**: `/appointments/:id`
- **方法**: `PUT`
- **描述**: 更新预约信息
- **请求体**:
  ```json
  {
    "patientId": "string", // 可选
    "doctorId": "string", // 可选
    "date": "YYYY-MM-DD", // 可选
    "time": "HH:MM", // 可选
    "duration": 30, // 可选
    "type": "checkup/treatment/consultation/followup", // 可选
    "status": "scheduled/confirmed/completed/cancelled/no_show", // 可选
    "notes": "string" // 可选
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "更新成功",
    "data": {
      "id": "string",
      "patientId": "string",
      "patientName": "string",
      "doctorId": "string",
      "doctorName": "string",
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "duration": 30,
      "type": "checkup/treatment/consultation/followup",
      "status": "scheduled/confirmed/completed/cancelled/no_show",
      "notes": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 删除预约

- **URL**: `/appointments/:id`
- **方法**: `DELETE`
- **描述**: 删除预约
- **响应**:
  ```json
  {
    "success": true,
    "message": "删除成功"
  }
  ```

## 随访记录 API

### 获取随访记录列表

- **URL**: `/patients/:patientId/followups`
- **方法**: `GET`
- **描述**: 获取指定患者的随访记录
- **请求参数**:
  ```
  startDate: 开始日期（可选，格式：YYYY-MM-DD）
  endDate: 结束日期（可选，格式：YYYY-MM-DD）
  status: 状态（可选，enum: completed/pending/cancelled）
  page: 页码（可选，默认1）
  limit: 每页数量（可选，默认20）
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 10,
      "list": [
        {
          "id": "string",
          "patientId": "string",
          "medicalRecordId": "string",
          "followUpDate": "YYYY-MM-DD",
          "method": "phone/visit/online",
          "content": "string",
          "result": "string",
          "nextFollowUp": "YYYY-MM-DD",
          "status": "completed/pending/cancelled",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
  }
  ```

### 创建随访记录

- **URL**: `/patients/:patientId/followups`
- **方法**: `POST`
- **描述**: 创建随访记录
- **请求体**:
  ```json
  {
    "medicalRecordId": "string",
    "followUpDate": "YYYY-MM-DD",
    "method": "phone/visit/online",
    "content": "string",
    "result": "string",
    "nextFollowUp": "YYYY-MM-DD",
    "status": "completed/pending/cancelled"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "创建成功",
    "data": {
      "id": "string",
      "patientId": "string",
      "medicalRecordId": "string",
      "followUpDate": "YYYY-MM-DD",
      "method": "phone/visit/online",
      "content": "string",
      "result": "string",
      "nextFollowUp": "YYYY-MM-DD",
      "status": "completed/pending/cancelled",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 更新随访记录

- **URL**: `/followups/:id`
- **方法**: `PUT`
- **描述**: 更新随访记录
- **请求体**:
  ```json
  {
    "followUpDate": "YYYY-MM-DD", // 可选
    "method": "phone/visit/online", // 可选
    "content": "string", // 可选
    "result": "string", // 可选
    "nextFollowUp": "YYYY-MM-DD", // 可选
    "status": "completed/pending/cancelled" // 可选
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "更新成功",
    "data": {
      "id": "string",
      "patientId": "string",
      "medicalRecordId": "string",
      "followUpDate": "YYYY-MM-DD",
      "method": "phone/visit/online",
      "content": "string",
      "result": "string",
      "nextFollowUp": "YYYY-MM-DD",
      "status": "completed/pending/cancelled",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 删除随访记录

- **URL**: `/followups/:id`
- **方法**: `DELETE`
- **描述**: 删除随访记录
- **响应**:
  ```json
  {
    "success": true,
    "message": "删除成功"
  }
  ```

## 库存管理 API

### 获取库存列表

- **URL**: `/inventory`
- **方法**: `GET`
- **描述**: 获取诊所库存列表
- **请求参数**:
  ```
  name: 产品名称（可选，模糊查询）
  category: 分类（可选，enum: medicine/instrument/consumable/other）
  status: 状态（可选，enum: normal/warning/empty）
  page: 页码（可选，默认1）
  limit: 每页数量（可选，默认20）
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 100,
      "list": [
        {
          "id": "string",
          "name": "string",
          "category": "medicine/instrument/consumable/other",
          "specification": "string",
          "unit": "string",
          "quantity": 100,
          "minQuantity": 20,
          "price": 99.99,
          "status": "normal/warning/empty",
          "location": "string",
          "description": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
  }
  ```

### 获取单个库存项

- **URL**: `/inventory/:id`
- **方法**: `GET`
- **描述**: 获取单个库存项详情
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "name": "string",
      "category": "medicine/instrument/consumable/other",
      "specification": "string",
      "unit": "string",
      "quantity": 100,
      "minQuantity": 20,
      "price": 99.99,
      "status": "normal/warning/empty",
      "location": "string",
      "description": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 添加库存项

- **URL**: `/inventory`
- **方法**: `POST`
- **描述**: 添加新的库存项
- **请求体**:
  ```json
  {
    "name": "string",
    "category": "medicine/instrument/consumable/other",
    "specification": "string",
    "unit": "string",
    "quantity": 100,
    "minQuantity": 20,
    "price": 99.99,
    "location": "string",
    "description": "string"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "添加成功",
    "data": {
      "id": "string",
      "name": "string",
      "category": "medicine/instrument/consumable/other",
      "specification": "string",
      "unit": "string",
      "quantity": 100,
      "minQuantity": 20,
      "price": 99.99,
      "status": "normal",
      "location": "string",
      "description": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 更新库存项

- **URL**: `/inventory/:id`
- **方法**: `PUT`
- **描述**: 更新库存项信息
- **请求体**:
  ```json
  {
    "name": "string", // 可选
    "category": "medicine/instrument/consumable/other", // 可选
    "specification": "string", // 可选
    "unit": "string", // 可选
    "quantity": 100, // 可选
    "minQuantity": 20, // 可选
    "price": 99.99, // 可选
    "location": "string", // 可选
    "description": "string" // 可选
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "更新成功",
    "data": {
      "id": "string",
      "name": "string",
      "category": "medicine/instrument/consumable/other",
      "specification": "string",
      "unit": "string",
      "quantity": 100,
      "minQuantity": 20,
      "price": 99.99,
      "status": "normal/warning/empty",
      "location": "string",
      "description": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 删除库存项

- **URL**: `/inventory/:id`
- **方法**: `DELETE`
- **描述**: 删除库存项
- **响应**:
  ```json
  {
    "success": true,
    "message": "删除成功"
  }
  ```

### 库存入库记录

- **URL**: `/inventory/in-records`
- **方法**: `GET`
- **描述**: 获取库存入库记录
- **请求参数**:
  ```
  inventoryId: 库存项ID（可选）
  startDate: 开始日期（可选，格式：YYYY-MM-DD）
  endDate: 结束日期（可选，格式：YYYY-MM-DD）
  page: 页码（可选，默认1）
  limit: 每页数量（可选，默认20）
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 50,
      "list": [
        {
          "id": "string",
          "inventoryId": "string",
          "inventoryName": "string",
          "quantity": 50,
          "price": 99.99,
          "totalPrice": 4999.50,
          "batchNumber": "string",
          "expireDate": "YYYY-MM-DD",
          "supplier": "string",
          "operatorId": "string",
          "operatorName": "string",
          "notes": "string",
          "createdAt": "string"
        }
      ]
    }
  }
  ```

### 添加入库记录

- **URL**: `/inventory/in-records`
- **方法**: `POST`
- **描述**: 添加库存入库记录
- **请求体**:
  ```json
  {
    "inventoryId": "string",
    "quantity": 50,
    "price": 99.99,
    "batchNumber": "string",
    "expireDate": "YYYY-MM-DD",
    "supplier": "string",
    "notes": "string"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "入库成功",
    "data": {
      "id": "string",
      "inventoryId": "string",
      "inventoryName": "string",
      "quantity": 50,
      "price": 99.99,
      "totalPrice": 4999.50,
      "batchNumber": "string",
      "expireDate": "YYYY-MM-DD",
      "supplier": "string",
      "operatorId": "string",
      "operatorName": "string",
      "notes": "string",
      "createdAt": "string"
    }
  }
  ```

### 库存出库记录

- **URL**: `/inventory/out-records`
- **方法**: `GET`
- **描述**: 获取库存出库记录
- **请求参数**:
  ```
  inventoryId: 库存项ID（可选）
  startDate: 开始日期（可选，格式：YYYY-MM-DD）
  endDate: 结束日期（可选，格式：YYYY-MM-DD）
  page: 页码（可选，默认1）
  limit: 每页数量（可选，默认20）
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 30,
      "list": [
        {
          "id": "string",
          "inventoryId": "string",
          "inventoryName": "string",
          "quantity": 5,
          "reason": "use/damage/expired/other",
          "patientId": "string",
          "patientName": "string",
          "operatorId": "string",
          "operatorName": "string",
          "notes": "string",
          "createdAt": "string"
        }
      ]
    }
  }
  ```

### 添加出库记录

- **URL**: `/inventory/out-records`
- **方法**: `POST`
- **描述**: 添加库存出库记录
- **请求体**:
  ```json
  {
    "inventoryId": "string",
    "quantity": 5,
    "reason": "use/damage/expired/other",
    "patientId": "string",
    "notes": "string"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "出库成功",
    "data": {
      "id": "string",
      "inventoryId": "string",
      "inventoryName": "string",
      "quantity": 5,
      "reason": "use/damage/expired/other",
      "patientId": "string",
      "patientName": "string",
      "operatorId": "string",
      "operatorName": "string",
      "notes": "string",
      "createdAt": "string"
    }
  }
  ```

## 药品管理 API

### 获取药品列表

- **URL**: `/medications`
- **方法**: `GET`
- **描述**: 获取药品列表
- **请求参数**:
  ```
  name: 药品名称（可选，模糊查询）
  type: 药品类型（可选）
  status: 状态（可选，enum: active/inactive）
  page: 页码（可选，默认1）
  limit: 每页数量（可选，默认20）
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 80,
      "list": [
        {
          "id": "string",
          "name": "string",
          "genericName": "string",
          "type": "string",
          "specification": "string",
          "manufacturer": "string",
          "unit": "string",
          "defaultDosage": "string",
          "usage": "string",
          "sideEffects": "string",
          "contraindications": "string",
          "price": 99.99,
          "status": "active/inactive",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
  }
  ```

### 获取单个药品

- **URL**: `/medications/:id`
- **方法**: `GET`
- **描述**: 获取单个药品详情
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "name": "string",
      "genericName": "string",
      "type": "string",
      "specification": "string",
      "manufacturer": "string",
      "unit": "string",
      "defaultDosage": "string",
      "usage": "string",
      "sideEffects": "string",
      "contraindications": "string",
      "price": 99.99,
      "status": "active/inactive",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 添加药品

- **URL**: `/medications`
- **方法**: `POST`
- **描述**: 添加新药品
- **请求体**:
  ```json
  {
    "name": "string",
    "genericName": "string",
    "type": "string",
    "specification": "string",
    "manufacturer": "string",
    "unit": "string",
    "defaultDosage": "string",
    "usage": "string",
    "sideEffects": "string",
    "contraindications": "string",
    "price": 99.99,
    "status": "active"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "添加成功",
    "data": {
      "id": "string",
      "name": "string",
      "genericName": "string",
      "type": "string",
      "specification": "string",
      "manufacturer": "string",
      "unit": "string",
      "defaultDosage": "string",
      "usage": "string",
      "sideEffects": "string",
      "contraindications": "string",
      "price": 99.99,
      "status": "active",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 更新药品

- **URL**: `/medications/:id`
- **方法**: `PUT`
- **描述**: 更新药品信息
- **请求体**:
  ```json
  {
    "name": "string", // 可选
    "genericName": "string", // 可选
    "type": "string", // 可选
    "specification": "string", // 可选
    "manufacturer": "string", // 可选
    "unit": "string", // 可选
    "defaultDosage": "string", // 可选
    "usage": "string", // 可选
    "sideEffects": "string", // 可选
    "contraindications": "string", // 可选
    "price": 99.99, // 可选
    "status": "active/inactive" // 可选
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "更新成功",
    "data": {
      "id": "string",
      "name": "string",
      "genericName": "string",
      "type": "string",
      "specification": "string",
      "manufacturer": "string",
      "unit": "string",
      "defaultDosage": "string",
      "usage": "string",
      "sideEffects": "string",
      "contraindications": "string",
      "price": 99.99,
      "status": "active/inactive",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 删除药品

- **URL**: `/medications/:id`
- **方法**: `DELETE`
- **描述**: 删除药品
- **响应**:
  ```json
  {
    "success": true,
    "message": "删除成功"
  }
  ```

## 财务管理 API

### 获取账单列表

- **URL**: `/finance/bills`
- **方法**: `GET`
- **描述**: 获取诊所账单列表
- **请求参数**:
  ```
  patientId: 患者ID（可选）
  patientName: 患者姓名（可选，模糊查询）
  billNumber: 账单编号（可选）
  status: 状态（可选，enum: unpaid/partially_paid/paid/cancelled）
  startDate: 开始日期（可选，格式：YYYY-MM-DD）
  endDate: 结束日期（可选，格式：YYYY-MM-DD）
  page: 页码（可选，默认1）
  limit: 每页数量（可选，默认20）
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 120,
      "list": [
        {
          "id": "string",
          "billNumber": "string",
          "patientId": "string",
          "patientName": "string",
          "totalAmount": 999.99,
          "paidAmount": 500.00,
          "dueAmount": 499.99,
          "discount": 0.00,
          "items": [
            {
              "name": "string",
              "category": "treatment/medication/material/other",
              "quantity": 1,
              "price": 999.99,
              "amount": 999.99
            }
          ],
          "status": "unpaid/partially_paid/paid/cancelled",
          "remark": "string",
          "operatorId": "string",
          "operatorName": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
  }
  ```

### 获取单个账单

- **URL**: `/finance/bills/:id`
- **方法**: `GET`
- **描述**: 获取单个账单详情
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "billNumber": "string",
      "patientId": "string",
      "patientName": "string",
      "totalAmount": 999.99,
      "paidAmount": 500.00,
      "dueAmount": 499.99,
      "discount": 0.00,
      "items": [
        {
          "name": "string",
          "category": "treatment/medication/material/other",
          "quantity": 1,
          "price": 999.99,
          "amount": 999.99
        }
      ],
      "status": "unpaid/partially_paid/paid/cancelled",
      "remark": "string",
      "operatorId": "string",
      "operatorName": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 创建账单

- **URL**: `/finance/bills`
- **方法**: `POST`
- **描述**: 创建新账单
- **请求体**:
  ```json
  {
    "patientId": "string",
    "items": [
      {
        "name": "string",
        "category": "treatment/medication/material/other",
        "quantity": 1,
        "price": 999.99
      }
    ],
    "discount": 0.00,
    "remark": "string"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "创建成功",
    "data": {
      "id": "string",
      "billNumber": "string",
      "patientId": "string",
      "patientName": "string",
      "totalAmount": 999.99,
      "paidAmount": 0.00,
      "dueAmount": 999.99,
      "discount": 0.00,
      "items": [
        {
          "name": "string",
          "category": "treatment/medication/material/other",
          "quantity": 1,
          "price": 999.99,
          "amount": 999.99
        }
      ],
      "status": "unpaid",
      "remark": "string",
      "operatorId": "string",
      "operatorName": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 更新账单

- **URL**: `/finance/bills/:id`
- **方法**: `PUT`
- **描述**: 更新账单信息（仅限未支付或部分支付状态）
- **请求体**:
  ```json
  {
    "patientId": "string", // 可选
    "items": [ // 可选
      {
        "name": "string",
        "category": "treatment/medication/material/other",
        "quantity": 1,
        "price": 999.99
      }
    ],
    "discount": 0.00, // 可选
    "remark": "string", // 可选
    "status": "cancelled" // 可选，只允许设置为cancelled
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "更新成功",
    "data": {
      "id": "string",
      "billNumber": "string",
      "patientId": "string",
      "patientName": "string",
      "totalAmount": 999.99,
      "paidAmount": 0.00,
      "dueAmount": 999.99,
      "discount": 0.00,
      "items": [
        {
          "name": "string",
          "category": "treatment/medication/material/other",
          "quantity": 1,
          "price": 999.99,
          "amount": 999.99
        }
      ],
      "status": "unpaid/partially_paid/cancelled",
      "remark": "string",
      "operatorId": "string",
      "operatorName": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 记录支付

- **URL**: `/finance/payments`
- **方法**: `POST`
- **描述**: 记录账单支付
- **请求体**:
  ```json
  {
    "billId": "string",
    "amount": 500.00,
    "paymentMethod": "cash/card/wechat/alipay/insurance/other",
    "paymentDate": "YYYY-MM-DD",
    "remark": "string"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "支付记录成功",
    "data": {
      "id": "string",
      "billId": "string",
      "billNumber": "string",
      "patientId": "string",
      "patientName": "string",
      "amount": 500.00,
      "paymentMethod": "cash/card/wechat/alipay/insurance/other",
      "paymentDate": "YYYY-MM-DD",
      "remark": "string",
      "operatorId": "string",
      "operatorName": "string",
      "createdAt": "string"
    }
  }
  ```

### 获取支付记录

- **URL**: `/finance/payments`
- **方法**: `GET`
- **描述**: 获取支付记录列表
- **请求参数**:
  ```
  billId: 账单ID（可选）
  billNumber: 账单编号（可选）
  patientId: 患者ID（可选）
  patientName: 患者姓名（可选，模糊查询）
  paymentMethod: 支付方式（可选）
  startDate: 开始日期（可选，格式：YYYY-MM-DD）
  endDate: 结束日期（可选，格式：YYYY-MM-DD）
  page: 页码（可选，默认1）
  limit: 每页数量（可选，默认20）
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 80,
      "list": [
        {
          "id": "string",
          "billId": "string",
          "billNumber": "string",
          "patientId": "string",
          "patientName": "string",
          "amount": 500.00,
          "paymentMethod": "cash/card/wechat/alipay/insurance/other",
          "paymentDate": "YYYY-MM-DD",
          "remark": "string",
          "operatorId": "string",
          "operatorName": "string",
          "createdAt": "string"
        }
      ]
    }
  }
  ```

### 获取财务统计

- **URL**: `/finance/statistics`
- **方法**: `GET`
- **描述**: 获取财务统计数据
- **请求参数**:
  ```
  startDate: 开始日期（必填，格式：YYYY-MM-DD）
  endDate: 结束日期（必填，格式：YYYY-MM-DD）
  type: 统计类型（可选，enum: daily/monthly/yearly，默认monthly）
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "summary": {
        "totalRevenue": 50000.00,
        "totalPaid": 40000.00,
        "totalUnpaid": 10000.00,
        "totalBills": 100,
        "averageBillAmount": 500.00
      },
      "details": [
        {
          "date": "2024-04",
          "revenue": 30000.00,
          "paid": 25000.00,
          "unpaid": 5000.00,
          "billCount": 60
        },
        {
          "date": "2024-03",
          "revenue": 20000.00,
          "paid": 15000.00,
          "unpaid": 5000.00,
          "billCount": 40
        }
      ],
      "paymentMethods": [
        {
          "method": "cash",
          "amount": 20000.00,
          "percentage": 50
        },
        {
          "method": "card",
          "amount": 10000.00,
          "percentage": 25
        },
        {
          "method": "wechat",
          "amount": 6000.00,
          "percentage": 15
        },
        {
          "method": "alipay",
          "amount": 4000.00,
          "percentage": 10
        }
      ]
    }
  }
  ```

## 数据统计 API

### 诊所概览统计

- **URL**: `/statistics/overview`
- **方法**: `GET`
- **描述**: 获取诊所运营概览数据
- **请求参数**:
  ```
  startDate: 开始日期（可选，格式：YYYY-MM-DD）
  endDate: 结束日期（可选，格式：YYYY-MM-DD）
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "patients": {
        "total": 1000,
        "new": 50,
        "active": 800
      },
      "appointments": {
        "total": 120,
        "completed": 90,
        "cancelled": 10,
        "noShow": 5,
        "upcoming": 15
      },
      "revenue": {
        "total": 50000.00,
        "paid": 40000.00,
        "unpaid": 10000.00
      },
      "treatments": {
        "total": 200,
        "categories": [
          {
            "name": "补牙",
            "count": 80,
            "percentage": 40
          },
          {
            "name": "洗牙",
            "count": 60,
            "percentage": 30
          },
          {
            "name": "拔牙",
            "count": 40,
            "percentage": 20
          },
          {
            "name": "其他",
            "count": 20,
            "percentage": 10
          }
        ]
      },
      "inventory": {
        "warning": 5,
        "empty": 2
      }
    }
  }
  ```

### 患者统计

- **URL**: `/statistics/patients`
- **方法**: `GET`
- **描述**: 获取患者相关统计数据
- **请求参数**:
  ```
  startDate: 开始日期（可选，格式：YYYY-MM-DD）
  endDate: 结束日期（可选，格式：YYYY-MM-DD）
  type: 统计类型（可选，enum: daily/monthly/yearly，默认monthly）
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 1000,
      "newPatients": {
        "total": 200,
        "trend": [
          {
            "date": "2024-04",
            "count": 30
          },
          {
            "date": "2024-03",
            "count": 25
          },
          {
            "date": "2024-02",
            "count": 20
          }
        ]
      },
      "demographics": {
        "gender": [
          {
            "value": "male",
            "count": 450,
            "percentage": 45
          },
          {
            "value": "female",
            "count": 550,
            "percentage": 55
          }
        ],
        "ageGroups": [
          {
            "range": "0-18",
            "count": 150,
            "percentage": 15
          },
          {
            "range": "19-35",
            "count": 300,
            "percentage": 30
          },
          {
            "range": "36-50",
            "count": 350,
            "percentage": 35
          },
          {
            "range": "51+",
            "count": 200,
            "percentage": 20
          }
        ]
      },
      "visitsFrequency": [
        {
          "visits": "1",
          "count": 500,
          "percentage": 50
        },
        {
          "visits": "2-5",
          "count": 300,
          "percentage": 30
        },
        {
          "visits": "6-10",
          "count": 150,
          "percentage": 15
        },
        {
          "visits": "10+",
          "count": 50,
          "percentage": 5
        }
      ]
    }
  }
  ```

### 预约统计

- **URL**: `/statistics/appointments`
- **方法**: `GET`
- **描述**: 获取预约相关统计数据
- **请求参数**:
  ```
  startDate: 开始日期（可选，格式：YYYY-MM-DD）
  endDate: 结束日期（可选，格式：YYYY-MM-DD）
  type: 统计类型（可选，enum: daily/monthly/yearly，默认monthly）
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 500,
      "trend": [
        {
          "date": "2024-04",
          "count": 120,
          "completed": 100,
          "cancelled": 10,
          "noShow": 10
        },
        {
          "date": "2024-03",
          "count": 110,
          "completed": 90,
          "cancelled": 15,
          "noShow": 5
        }
      ],
      "byDoctor": [
        {
          "doctorId": "string",
          "doctorName": "张医生",
          "count": 250,
          "percentage": 50
        },
        {
          "doctorId": "string",
          "doctorName": "李医生",
          "count": 150,
          "percentage": 30
        },
        {
          "doctorId": "string",
          "doctorName": "王医生",
          "count": 100,
          "percentage": 20
        }
      ],
      "byType": [
        {
          "type": "treatment",
          "count": 300,
          "percentage": 60
        },
        {
          "type": "checkup",
          "count": 100,
          "percentage": 20
        },
        {
          "type": "consultation",
          "count": 50,
          "percentage": 10
        },
        {
          "type": "followup",
          "count": 50,
          "percentage": 10
        }
      ],
      "byTimeSlot": [
        {
          "slot": "8:00-10:00",
          "count": 150,
          "percentage": 30
        },
        {
          "slot": "10:00-12:00",
          "count": 200,
          "percentage": 40
        },
        {
          "slot": "14:00-16:00",
          "count": 100,
          "percentage": 20
        },
        {
          "slot": "16:00-18:00",
          "count": 50,
          "percentage": 10
        }
      ],
      "noShowRate": 5.5,
      "cancellationRate": 7.2
    }
  }
  ```

### 治疗统计

- **URL**: `/statistics/treatments`
- **方法**: `GET`
- **描述**: 获取治疗相关统计数据
- **请求参数**:
  ```
  startDate: 开始日期（可选，格式：YYYY-MM-DD）
  endDate: 结束日期（可选，格式：YYYY-MM-DD）
  type: 统计类型（可选，enum: daily/monthly/yearly，默认monthly）
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 650,
      "trend": [
        {
          "date": "2024-04",
          "count": 150
        },
        {
          "date": "2024-03",
          "count": 130
        }
      ],
      "byCategory": [
        {
          "category": "补牙",
          "count": 200,
          "percentage": 30.8,
          "revenue": 20000.00
        },
        {
          "category": "洗牙",
          "count": 150,
          "percentage": 23.1,
          "revenue": 15000.00
        },
        {
          "category": "拔牙",
          "count": 100,
          "percentage": 15.4,
          "revenue": 10000.00
        },
        {
          "category": "根管治疗",
          "count": 80,
          "percentage": 12.3,
          "revenue": 16000.00
        },
        {
          "category": "牙齿矫正",
          "count": 70,
          "percentage": 10.8,
          "revenue": 35000.00
        },
        {
          "category": "其他",
          "count": 50,
          "percentage": 7.7,
          "revenue": 10000.00
        }
      ],
      "byDoctor": [
        {
          "doctorId": "string",
          "doctorName": "张医生",
          "count": 300,
          "percentage": 46.2
        },
        {
          "doctorId": "string",
          "doctorName": "李医生",
          "count": 200,
          "percentage": 30.8
        },
        {
          "doctorId": "string",
          "doctorName": "王医生",
          "count": 150,
          "percentage": 23.1
        }
      ]
    }
  }
  ```

## 诊所服务 API

### 获取服务列表

- **URL**: `/clinic-services`
- **方法**: `GET`
- **描述**: 获取诊所提供的服务列表
- **请求参数**:
  ```
  name: 服务名称（可选，模糊查询）
  category: 服务分类（可选）
  status: 状态（可选，enum: active/inactive）
  page: 页码（可选，默认1）
  limit: 每页数量（可选，默认20）
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 30,
      "list": [
        {
          "id": "string",
          "name": "string",
          "category": "string",
          "description": "string",
          "price": 999.99,
          "duration": 60,
          "status": "active/inactive",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
  }
  ```

### 获取单个服务

- **URL**: `/clinic-services/:id`
- **方法**: `GET`
- **描述**: 获取单个服务详情
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "name": "string",
      "category": "string",
      "description": "string",
      "price": 999.99,
      "duration": 60,
      "status": "active/inactive",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 创建服务

- **URL**: `/clinic-services`
- **方法**: `POST`
- **描述**: 创建新的诊所服务
- **请求体**:
  ```json
  {
    "name": "string",
    "category": "string",
    "description": "string",
    "price": 999.99,
    "duration": 60,
    "status": "active"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "创建成功",
    "data": {
      "id": "string",
      "name": "string",
      "category": "string",
      "description": "string",
      "price": 999.99,
      "duration": 60,
      "status": "active",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 更新服务

- **URL**: `/clinic-services/:id`
- **方法**: `PUT`
- **描述**: 更新服务信息
- **请求体**:
  ```json
  {
    "name": "string", // 可选
    "category": "string", // 可选
    "description": "string", // 可选
    "price": 999.99, // 可选
    "duration": 60, // 可选
    "status": "active/inactive" // 可选
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "更新成功",
    "data": {
      "id": "string",
      "name": "string",
      "category": "string",
      "description": "string",
      "price": 999.99,
      "duration": 60,
      "status": "active/inactive",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

### 删除服务

- **URL**: `/clinic-services/:id`
- **方法**: `DELETE`
- **描述**: 删除服务
- **响应**:
  ```json
  {
    "success": true,
    "message": "删除成功"
  }
  ```

### 获取服务分类

- **URL**: `/clinic-services/categories`
- **方法**: `GET`
- **描述**: 获取服务分类列表
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "name": "string",
        "count": 5
      }
    ]
  }
  ```

## 系统设置 API

### 获取系统配置

- **URL**: `/settings`
- **方法**: `GET`
- **描述**: 获取系统配置信息
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "clinic": {
        "name": "牙科诊所名称",
        "address": "详细地址",
        "phone": "联系电话",
        "email": "电子邮箱",
        "website": "网站",
        "logo": "Logo图片URL",
        "description": "诊所简介",
        "businessHours": [
          {
            "day": "monday",
            "open": true,
            "startTime": "09:00",
            "endTime": "18:00",
            "breakStart": "12:00",
            "breakEnd": "13:00"
          },
          {
            "day": "tuesday",
            "open": true,
            "startTime": "09:00",
            "endTime": "18:00",
            "breakStart": "12:00",
            "breakEnd": "13:00"
          }
        ]
      },
      "appointment": {
        "defaultDuration": 30,
        "minAdvanceTime": 1, // 最少提前预约时间(小时)
        "maxAdvanceDays": 30, // 最大提前预约天数
        "reminderEnabled": true,
        "reminderTime": 24 // 提前多少小时发送提醒
      },
      "notification": {
        "smsEnabled": true,
        "emailEnabled": false,
        "wechatEnabled": true,
        "templates": {
          "appointmentReminder": "尊敬的{patientName}，提醒您明天{appointmentTime}在我院的{appointmentType}预约，请准时到诊。如需取消，请提前联系我们。",
          "appointmentConfirmation": "尊敬的{patientName}，您已成功预约{appointmentDate} {appointmentTime}的{appointmentType}，诊所地址：{clinicAddress}。如有问题，请联系我们。"
        }
      }
    }
  }
  ```

### 更新系统配置

- **URL**: `/settings`
- **方法**: `PUT`
- **描述**: 更新系统配置
- **请求体**:
  ```json
  {
    "clinic": {
      "name": "牙科诊所名称", // 可选
      "address": "详细地址", // 可选
      "phone": "联系电话", // 可选
      "email": "电子邮箱", // 可选
      "website": "网站", // 可选
      "logo": "Logo图片URL", // 可选
      "description": "诊所简介", // 可选
      "businessHours": [ // 可选
        {
          "day": "monday",
          "open": true,
          "startTime": "09:00",
          "endTime": "18:00",
          "breakStart": "12:00",
          "breakEnd": "13:00"
        }
      ]
    },
    "appointment": { // 可选
      "defaultDuration": 30,
      "minAdvanceTime": 1,
      "maxAdvanceDays": 30,
      "reminderEnabled": true,
      "reminderTime": 24
    },
    "notification": { // 可选
      "smsEnabled": true,
      "emailEnabled": false,
      "wechatEnabled": true,
      "templates": {
        "appointmentReminder": "尊敬的{patientName}，提醒您明天{appointmentTime}在我院的{appointmentType}预约，请准时到诊。如需取消，请提前联系我们。",
        "appointmentConfirmation": "尊敬的{patientName}，您已成功预约{appointmentDate} {appointmentTime}的{appointmentType}，诊所地址：{clinicAddress}。如有问题，请联系我们。"
      }
    }
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "更新成功",
    "data": {
      // 返回更新后的完整配置，格式同 GET 请求
    }
  }
  ```

### 获取系统日志

- **URL**: `/logs`
- **方法**: `GET`
- **描述**: 获取系统操作日志（仅管理员可访问）
- **请求参数**:
  ```
  userId: 用户ID（可选）
  action: 操作类型（可选，如：login/logout/create/update/delete）
  module: 模块（可选，如：user/patient/appointment）
  startDate: 开始日期（可选，格式：YYYY-MM-DD）
  endDate: 结束日期（可选，格式：YYYY-MM-DD）
  page: 页码（可选，默认1）
  limit: 每页数量（可选，默认20）
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 500,
      "list": [
        {
          "id": "string",
          "userId": "string",
          "username": "string",
          "action": "string",
          "module": "string",
          "description": "string",
          "ip": "string",
          "userAgent": "string",
          "createdAt": "string"
        }
      ]
    }
  }
  ```

### 上传文件

- **URL**: `/upload`
- **方法**: `POST`
- **描述**: 上传文件到系统
- **请求体**: 
  - 使用 `multipart/form-data` 格式
  - 字段名: `file`
  - 可选参数:
    - `type`: 文件类型，如 `avatar`, `patient`, `record` 等
    - `relatedId`: 关联的ID，如患者ID、记录ID等
- **响应**:
  ```json
  {
    "success": true,
    "message": "上传成功",
    "data": {
      "id": "string",
      "filename": "string",
      "originalName": "string",
      "mimeType": "string",
      "size": 1024,
      "url": "string",
      "type": "string",
      "relatedId": "string",
      "createdAt": "string"
    }
  }
  ```

### 删除文件

- **URL**: `/upload/:id`
- **方法**: `DELETE`
- **描述**: 删除已上传的文件
- **响应**:
  ```json
  {
    "success": true,
    "message": "删除成功"
  }
  ```

## API版本和健康检查

### 获取API版本

- **URL**: `/version`
- **方法**: `GET`
- **描述**: 获取API版本信息
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "version": "1.0.0",
      "buildDate": "2024-04-15",
      "environment": "production"
    }
  }
  ```

### 健康检查

- **URL**: `/health`
- **方法**: `GET`
- **描述**: API健康状态检查
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "status": "ok",
      "uptime": 3600,
      "timestamp": "2024-04-15T10:00:00Z",
      "services": {
        "database": "ok",
        "cache": "ok",
        "storage": "ok"
      }
    }
  }
  ``` 