# 患者管理 API 文档

## 概述
本文档详细描述了牙科诊所患者管理系统的 API 接口，包括患者信息管理、预约管理和医疗记录管理。

## 基础信息
- **Base URL**: `/api/dental`
- **认证方式**: Bearer Token (JWT)
- **请求头**: 
  ```
  Authorization: Bearer {token}
  Content-Type: application/json
  ```

## 患者管理

### 1. 获取患者列表
获取所有患者的分页列表。

**请求**:
- **方法**: GET
- **路径**: `/dental/patients`
- **查询参数**:
  - `page`: 页码 (默认: 1)
  - `pageSize`: 每页条数 (默认: 10)
  - `name`: 按姓名筛选（可选）
  - `phoneNumber`: 按电话号码筛选（可选）
  - `idNumber`: 按身份证号筛选（可选）

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "患者姓名",
        "gender": "M/F",
        "birthDate": "YYYY-MM-DD",
        "phoneNumber": "手机号码",
        "idNumber": "身份证号",
        "address": "地址",
        "notes": "备注信息",
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

### 2. 获取患者详情
获取特定患者的详细信息。

**请求**:
- **方法**: GET
- **路径**: `/dental/patients/{id}`

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "患者姓名",
    "gender": "M/F",
    "birthDate": "YYYY-MM-DD",
    "phoneNumber": "手机号码",
    "idNumber": "身份证号",
    "address": "地址",
    "notes": "备注信息",
    "createdAt": "YYYY-MM-DDTHH:MM:SS.sssZ",
    "updatedAt": "YYYY-MM-DDTHH:MM:SS.sssZ"
  }
}
```

### 3. 创建患者
创建新的患者记录。

**请求**:
- **方法**: POST
- **路径**: `/dental/patients`
- **请求体**:
```json
{
  "name": "患者姓名",
  "gender": "M/F",
  "birthDate": "YYYY-MM-DD",
  "phoneNumber": "手机号码",
  "idNumber": "身份证号",
  "address": "地址",
  "notes": "备注信息"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "患者姓名",
    "gender": "M/F",
    "birthDate": "YYYY-MM-DD",
    "phoneNumber": "手机号码",
    "idNumber": "身份证号",
    "address": "地址",
    "notes": "备注信息",
    "createdAt": "YYYY-MM-DDTHH:MM:SS.sssZ",
    "updatedAt": "YYYY-MM-DDTHH:MM:SS.sssZ"
  }
}
```

### 4. 更新患者信息
更新现有患者的信息。

**请求**:
- **方法**: PUT
- **路径**: `/dental/patients/{id}`
- **请求体** (只需包含要更新的字段):
```json
{
  "name": "更新后的患者姓名",
  "notes": "更新后的备注信息"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "更新后的患者姓名",
    "gender": "M/F",
    "birthDate": "YYYY-MM-DD",
    "phoneNumber": "手机号码",
    "idNumber": "身份证号",
    "address": "地址",
    "notes": "更新后的备注信息",
    "createdAt": "YYYY-MM-DDTHH:MM:SS.sssZ",
    "updatedAt": "YYYY-MM-DDTHH:MM:SS.sssZ"
  }
}
```

## 预约管理

### 1. 创建预约
为患者创建新的预约。

**请求**:
- **方法**: POST
- **路径**: `/dental/appointments`
- **请求体**:
```json
{
  "patientId": "患者ID",
  "appointmentTime": "YYYY-MM-DDTHH:MM:SS.sssZ",
  "duration": 30,
  "type": "checkup",
  "reason": "初诊检查",
  "status": "scheduled",
  "notes": "预约备注"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "patientId": "患者ID",
    "appointmentTime": "YYYY-MM-DDTHH:MM:SS.sssZ",
    "duration": 30,
    "type": "checkup",
    "reason": "初诊检查",
    "status": "scheduled",
    "notes": "预约备注",
    "createdAt": "YYYY-MM-DDTHH:MM:SS.sssZ",
    "updatedAt": "YYYY-MM-DDTHH:MM:SS.sssZ"
  }
}
```

## 医疗记录管理

### 1. 创建医疗记录
为患者创建新的医疗记录。

**请求**:
- **方法**: POST
- **路径**: `/dental/patients/{patientId}/records`
- **请求体**:
```json
{
  "patientId": "患者ID",
  "visitDate": "YYYY-MM-DDTHH:MM:SS.sssZ",
  "attendingDoctor": "张医生",
  "chiefComplaint": "牙痛",
  "diagnosis": "牙龈炎",
  "treatmentPlan": "洗牙并服用消炎药",
  "medications": "阿莫西林胶囊 一日三次",
  "cost": 300,
  "isPaid": false,
  "notes": "医疗记录备注"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "patientId": "患者ID",
    "visitDate": "YYYY-MM-DDTHH:MM:SS.sssZ",
    "attendingDoctor": "张医生",
    "chiefComplaint": "牙痛", 
    "diagnosis": "牙龈炎",
    "treatmentPlan": "洗牙并服用消炎药",
    "medications": "阿莫西林胶囊 一日三次",
    "cost": 300,
    "isPaid": false,
    "notes": "医疗记录备注",
    "createdAt": "YYYY-MM-DDTHH:MM:SS.sssZ",
    "updatedAt": "YYYY-MM-DDTHH:MM:SS.sssZ"
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