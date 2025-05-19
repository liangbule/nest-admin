# 患者管理 API 文档

## 概述
患者管理API提供了对牙科诊所患者信息的全面管理能力，包括患者基本信息管理、预约管理、病历记录和账单管理。

## 患者基本信息管理

### 获取患者列表
获取分页的患者列表，支持多种筛选条件。

**请求**
- 方法: `GET`
- 接口: `/api/dental/patients/list`
- 查询参数:
  - `page`: 页码（默认: 1）
  - `pageSize`: 每页数量（默认: 10）
  - `name`: 按姓名筛选
  - `phoneNumber`: 按电话号码筛选
  - `idNumber`: 按身份证号筛选

**响应**
```json
{
  "code": 200,
  "message": "获取患者列表成功",
  "data": {
    "total": 150,
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "张三",
        "gender": "男",
        "age": 35,
        "phoneNumber": "13800138000",
        "idNumber": "110101198505151234",
        "address": "北京市朝阳区建国路1号",
        "createdAt": "2023-01-15T08:30:00.000Z",
        "updatedAt": "2023-05-01T11:45:00.000Z"
      },
      // 更多患者...
    ]
  }
}
```

### 获取患者详情
根据ID获取特定患者的详细信息。

**请求**
- 方法: `GET`
- 接口: `/api/dental/patients/:id`
- 路径参数:
  - `id`: 患者ID

**响应**
```json
{
  "code": 200,
  "message": "获取患者详情成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "张三",
    "gender": "男",
    "age": 35,
    "birthDate": "1985-05-15",
    "phoneNumber": "13800138000",
    "emergencyContact": "李四",
    "emergencyPhone": "13900139000",
    "idNumber": "110101198505151234",
    "address": "北京市朝阳区建国路1号",
    "medicalHistory": {
      "allergies": ["青霉素"],
      "chronicConditions": ["高血压"],
      "medications": ["降压药"]
    },
    "lastVisit": "2023-04-15T09:30:00.000Z",
    "createdAt": "2023-01-15T08:30:00.000Z",
    "updatedAt": "2023-05-01T11:45:00.000Z"
  }
}
```

### 创建患者
创建新的患者记录。

**请求**
- 方法: `POST`
- 接口: `/api/dental/patients`
- 请求体:
```json
{
  "name": "李四",
  "gender": "女",
  "birthDate": "1990-08-20",
  "phoneNumber": "13700137000",
  "emergencyContact": "王五",
  "emergencyPhone": "13600136000",
  "idNumber": "110101199008201234",
  "address": "北京市海淀区中关村大街1号",
  "medicalHistory": {
    "allergies": ["磺胺类药物"],
    "chronicConditions": [],
    "medications": []
  }
}
```

**响应**
```json
{
  "code": 201,
  "message": "创建患者成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "李四",
    "gender": "女",
    "age": 33,
    "birthDate": "1990-08-20",
    "phoneNumber": "13700137000",
    "emergencyContact": "王五",
    "emergencyPhone": "13600136000",
    "idNumber": "110101199008201234",
    "address": "北京市海淀区中关村大街1号",
    "medicalHistory": {
      "allergies": ["磺胺类药物"],
      "chronicConditions": [],
      "medications": []
    },
    "createdAt": "2023-06-01T10:15:00.000Z",
    "updatedAt": "2023-06-01T10:15:00.000Z"
  }
}
```

### 更新患者信息
更新现有患者的信息。

**请求**
- 方法: `PUT`
- 接口: `/api/dental/patients/:id`
- 路径参数:
  - `id`: 患者ID
- 请求体:
```json
{
  "phoneNumber": "13711137111",
  "address": "北京市海淀区中关村大街10号",
  "medicalHistory": {
    "allergies": ["磺胺类药物", "头孢类药物"],
    "chronicConditions": ["糖尿病"],
    "medications": ["降糖药"]
  }
}
```

**响应**
```json
{
  "code": 200,
  "message": "更新患者信息成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "李四",
    "gender": "女",
    "age": 33,
    "birthDate": "1990-08-20",
    "phoneNumber": "13711137111",
    "emergencyContact": "王五",
    "emergencyPhone": "13600136000",
    "idNumber": "110101199008201234",
    "address": "北京市海淀区中关村大街10号",
    "medicalHistory": {
      "allergies": ["磺胺类药物", "头孢类药物"],
      "chronicConditions": ["糖尿病"],
      "medications": ["降糖药"]
    },
    "createdAt": "2023-06-01T10:15:00.000Z",
    "updatedAt": "2023-06-05T14:30:00.000Z"
  }
}
```

### 删除患者
删除特定患者。

**请求**
- 方法: `DELETE`
- 接口: `/api/dental/patients/:id`
- 路径参数:
  - `id`: 患者ID

**响应**
```json
{
  "code": 200,
  "message": "删除患者成功"
}
```

## 患者预约管理

### 获取患者预约列表
获取特定患者的预约列表。

**请求**
- 方法: `GET`
- 接口: `/api/dental/patients/:id/appointments`
- 路径参数:
  - `id`: 患者ID
- 查询参数:
  - `page`: 页码（默认: 1）
  - `pageSize`: 每页数量（默认: 10）
  - `startDate`: 开始日期（YYYY-MM-DD）
  - `endDate`: 结束日期（YYYY-MM-DD）
  - `status`: 预约状态（confirmed, cancelled, completed）

**响应**
```json
{
  "code": 200,
  "message": "获取患者预约列表成功",
  "data": {
    "total": 5,
    "items": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "patientId": "550e8400-e29b-41d4-a716-446655440001",
        "patientName": "李四",
        "appointmentDate": "2023-06-10T09:00:00.000Z",
        "duration": 60,
        "doctor": "王医生",
        "treatmentType": "牙齿清洁",
        "status": "confirmed",
        "notes": "初次洁牙",
        "createdAt": "2023-06-01T15:20:00.000Z",
        "updatedAt": "2023-06-01T15:20:00.000Z"
      },
      // 更多预约...
    ]
  }
}
```

### 创建预约
为患者创建新的预约。

**请求**
- 方法: `POST`
- 接口: `/api/dental/appointments`
- 请求体:
```json
{
  "patientId": "550e8400-e29b-41d4-a716-446655440001",
  "appointmentDate": "2023-07-15T14:30:00.000Z",
  "duration": 45,
  "doctor": "张医生",
  "treatmentType": "龋齿治疗",
  "notes": "左下磨牙龋齿治疗"
}
```

**响应**
```json
{
  "code": 201,
  "message": "创建预约成功",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "patientId": "550e8400-e29b-41d4-a716-446655440001",
    "patientName": "李四",
    "appointmentDate": "2023-07-15T14:30:00.000Z",
    "duration": 45,
    "doctor": "张医生",
    "treatmentType": "龋齿治疗",
    "status": "confirmed",
    "notes": "左下磨牙龋齿治疗",
    "createdAt": "2023-06-15T11:45:00.000Z",
    "updatedAt": "2023-06-15T11:45:00.000Z"
  }
}
```

## 患者病历管理

### 获取患者病历列表
获取特定患者的病历列表。

**请求**
- 方法: `GET`
- 接口: `/api/dental/patients/:id/medical-records`
- 路径参数:
  - `id`: 患者ID
- 查询参数:
  - `page`: 页码（默认: 1）
  - `pageSize`: 每页数量（默认: 10）
  - `recordType`: 记录类型（examination, treatment, followup）

**响应**
```json
{
  "code": 200,
  "message": "获取患者病历列表成功",
  "data": {
    "total": 8,
    "items": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "patientId": "550e8400-e29b-41d4-a716-446655440001",
        "patientName": "李四",
        "recordDate": "2023-06-10T09:30:00.000Z",
        "doctor": "王医生",
        "recordType": "examination",
        "diagnosis": "牙齿健康状况良好，建议定期洁牙",
        "treatmentPlan": "洁牙",
        "attachments": [
          {
            "id": "880e8400-e29b-41d4-a716-446655440000",
            "fileName": "牙齿X光片.jpg",
            "fileType": "image/jpeg",
            "fileSize": 256000,
            "uploadDate": "2023-06-10T09:45:00.000Z"
          }
        ],
        "createdAt": "2023-06-10T10:00:00.000Z",
        "updatedAt": "2023-06-10T10:00:00.000Z"
      },
      // 更多病历...
    ]
  }
}
```

### 创建病历记录
为患者创建新的病历记录。

**请求**
- 方法: `POST`
- 接口: `/api/dental/medical-records`
- 格式: `multipart/form-data`
- 参数:
  - `patientId`: 患者ID
  - `recordDate`: 记录日期
  - `doctor`: 医生姓名
  - `recordType`: 记录类型
  - `diagnosis`: 诊断结果
  - `treatmentPlan`: 治疗计划
  - `notes`: 备注
  - `files`: 附件文件（可多个）

**响应**
```json
{
  "code": 201,
  "message": "创建病历记录成功",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "patientId": "550e8400-e29b-41d4-a716-446655440001",
    "patientName": "李四",
    "recordDate": "2023-07-15T15:00:00.000Z",
    "doctor": "张医生",
    "recordType": "treatment",
    "diagnosis": "左下第一磨牙龋齿",
    "treatmentPlan": "进行补牙治疗",
    "notes": "患者对局部麻醉剂不适，使用替代方案",
    "attachments": [
      {
        "id": "880e8400-e29b-41d4-a716-446655440001",
        "fileName": "治疗前照片.jpg",
        "fileType": "image/jpeg",
        "fileSize": 320000,
        "uploadDate": "2023-07-15T15:15:00.000Z"
      },
      {
        "id": "880e8400-e29b-41d4-a716-446655440002",
        "fileName": "治疗后照片.jpg",
        "fileType": "image/jpeg",
        "fileSize": 315000,
        "uploadDate": "2023-07-15T15:45:00.000Z"
      }
    ],
    "createdAt": "2023-07-15T16:00:00.000Z",
    "updatedAt": "2023-07-15T16:00:00.000Z"
  }
}
```

## 患者账单管理

### 获取患者账单列表
获取特定患者的账单列表。

**请求**
- 方法: `GET`
- 接口: `/api/dental/patients/:id/invoices`
- 路径参数:
  - `id`: 患者ID
- 查询参数:
  - `page`: 页码（默认: 1）
  - `pageSize`: 每页数量（默认: 10）
  - `status`: 账单状态（pending, paid, cancelled）
  - `startDate`: 开始日期（YYYY-MM-DD）
  - `endDate`: 结束日期（YYYY-MM-DD）

**响应**
```json
{
  "code": 200,
  "message": "获取患者账单列表成功",
  "data": {
    "total": 3,
    "items": [
      {
        "id": "990e8400-e29b-41d4-a716-446655440000",
        "patientId": "550e8400-e29b-41d4-a716-446655440001",
        "patientName": "李四",
        "invoiceNumber": "INV-2023-001",
        "invoiceDate": "2023-06-10T10:30:00.000Z",
        "amount": 500.00,
        "status": "paid",
        "paymentMethod": "微信支付",
        "paymentDate": "2023-06-10T10:35:00.000Z",
        "items": [
          {
            "description": "口腔检查",
            "quantity": 1,
            "unitPrice": 100.00,
            "amount": 100.00
          },
          {
            "description": "洁牙",
            "quantity": 1,
            "unitPrice": 400.00,
            "amount": 400.00
          }
        ],
        "createdAt": "2023-06-10T10:30:00.000Z",
        "updatedAt": "2023-06-10T10:35:00.000Z"
      },
      // 更多账单...
    ]
  }
}
```

### 创建账单
为患者创建新的账单。

**请求**
- 方法: `POST`
- 接口: `/api/dental/invoices`
- 请求体:
```json
{
  "patientId": "550e8400-e29b-41d4-a716-446655440001",
  "invoiceDate": "2023-07-15T16:30:00.000Z",
  "items": [
    {
      "description": "龋齿治疗",
      "quantity": 1,
      "unitPrice": 800.00
    },
    {
      "description": "药品费用",
      "quantity": 2,
      "unitPrice": 50.00
    }
  ],
  "remarks": "左下磨牙龋齿治疗费用"
}
```

**响应**
```json
{
  "code": 201,
  "message": "创建账单成功",
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "patientId": "550e8400-e29b-41d4-a716-446655440001",
    "patientName": "李四",
    "invoiceNumber": "INV-2023-023",
    "invoiceDate": "2023-07-15T16:30:00.000Z",
    "amount": 900.00,
    "status": "pending",
    "items": [
      {
        "description": "龋齿治疗",
        "quantity": 1,
        "unitPrice": 800.00,
        "amount": 800.00
      },
      {
        "description": "药品费用",
        "quantity": 2,
        "unitPrice": 50.00,
        "amount": 100.00
      }
    ],
    "remarks": "左下磨牙龋齿治疗费用",
    "createdAt": "2023-07-15T16:35:00.000Z",
    "updatedAt": "2023-07-15T16:35:00.000Z"
  }
}
```

## 数据模型

### 患者
```typescript
interface 患者 {
  id: string;
  name: string;                    // 姓名
  gender: string;                  // 性别
  age?: number;                    // 年龄（计算值）
  birthDate: string;              // 出生日期
  phoneNumber: string;            // 电话号码
  emergencyContact?: string;      // 紧急联系人
  emergencyPhone?: string;        // 紧急联系人电话
  idNumber?: string;              // 身份证号
  address?: string;               // 地址
  medicalHistory?: {              // 医疗史
    allergies: string[];          // 过敏史
    chronicConditions: string[];  // 慢性病
    medications: string[];        // 在服用药物
  };
  lastVisit?: string;             // 上次就诊日期
  createdAt: string;              // 创建时间
  updatedAt: string;              // 更新时间
  deleteTime?: string;            // 删除时间（软删除）
}
```

### 预约
```typescript
interface 预约 {
  id: string;
  patientId: string;              // 患者ID
  patientName?: string;           // 患者姓名（响应中包含）
  appointmentDate: string;        // 预约日期时间
  duration: number;               // 预计时长（分钟）
  doctor: string;                 // 医生姓名
  treatmentType: string;          // 治疗类型
  status: string;                 // 状态：已确认、已取消、已完成
  notes?: string;                 // 备注
  createdAt: string;              // 创建时间
  updatedAt: string;              // 更新时间
  deleteTime?: string;            // 删除时间（软删除）
}
```

### 病历记录
```typescript
interface 病历记录 {
  id: string;
  patientId: string;              // 患者ID
  patientName?: string;           // 患者姓名（响应中包含）
  recordDate: string;             // 记录日期
  doctor: string;                 // 医生姓名
  recordType: string;             // 记录类型：检查、治疗、随访
  diagnosis: string;              // 诊断结果
  treatmentPlan?: string;         // 治疗计划
  notes?: string;                 // 备注
  attachments?: 附件[];           // 附件
  createdAt: string;              // 创建时间
  updatedAt: string;              // 更新时间
  deleteTime?: string;            // 删除时间（软删除）
}

interface 附件 {
  id: string;
  fileName: string;               // 文件名
  fileType: string;               // 文件类型
  fileSize: number;               // 文件大小（字节）
  uploadDate: string;             // 上传日期
}
```

### 账单
```typescript
interface 账单 {
  id: string;
  patientId: string;              // 患者ID
  patientName?: string;           // 患者姓名（响应中包含）
  invoiceNumber: string;          // 账单编号
  invoiceDate: string;            // 账单日期
  amount: number;                 // 总金额
  status: string;                 // 状态：待付款、已付款、已取消
  paymentMethod?: string;         // 支付方式
  paymentDate?: string;           // 支付日期
  items: 账单项目[];               // 账单项目
  remarks?: string;               // 备注
  createdAt: string;              // 创建时间
  updatedAt: string;              // 更新时间
  deleteTime?: string;            // 删除时间（软删除）
}

interface 账单项目 {
  description: string;            // 项目描述
  quantity: number;               // 数量
  unitPrice: number;              // 单价
  amount: number;                 // 小计金额
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
      "field": "name",
      "message": "患者姓名为必填项"
    },
    {
      "field": "phoneNumber",
      "message": "电话号码格式不正确"
    }
  ]
}
```

### 资源未找到
```json
{
  "code": 404,
  "message": "未找到患者"
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

1. **患者注册**：新患者到诊所就诊前，需先创建患者记录。
2. **预约管理**：患者可预约特定日期和时间的就诊。
3. **就诊流程**：患者按预约时间到诊，医生进行诊断和治疗。
4. **病历记录**：医生记录患者诊断和治疗信息，可附加相关影像资料。
5. **账单结算**：完成治疗后，系统生成账单，患者完成支付。
6. **随访管理**：根据治疗情况，安排必要的随访和复查。 