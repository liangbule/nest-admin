# 牙科诊所管理系统 Swagger 装饰器使用指南

## 概述

本指南详细说明如何使用 Swagger 装饰器为牙科诊所管理系统的 API 端点添加文档。正确使用这些装饰器可确保所有 API 端点在 Swagger UI 中正确显示，便于前端开发人员和其他团队成员理解和使用 API。

## 系统结构说明

- **API文档访问地址**: `http://localhost:3000/api/docs`
- **API基础路径**: `/api`
- **测试脚本位置**: `src/test/`
- **工具脚本位置**: `src/script/`

## 基本装饰器

### 控制器级别装饰器

每个控制器文件应包含以下装饰器：

```typescript
@ApiBearerAuth()             // 指示此API需要Bearer令牌认证
@UseGuards(JwtAuthGuard)     // 应用JWT认证守卫
@Controller('dental')        // 定义基础路径
export class DentalController {
  // ...
}
```

### API 分类装饰器

使用 `@ApiTags` 装饰器对 API 进行分类，我们采用两级分类结构：

```typescript
@ApiTags('牙科诊所管理', '患者管理')  // 第一个参数是主分类，第二个是子分类
```

可用的子分类包括：
- 患者管理
- 预约管理
- 病历管理
- 随访管理
- 库存管理

## 方法级别装饰器

每个 API 端点方法都应包含以下装饰器：

### 1. API 操作描述

```typescript
@ApiOperation({ 
  summary: '获取患者列表',                          // 简短描述
  description: '获取所有患者的列表，支持分页和过滤'  // 详细描述（可选）
})
```

### 2. API 响应

```typescript
@ApiResponse({ status: 200, description: '成功返回患者列表' })
@ApiResponse({ status: 401, description: '未授权' })
@ApiResponse({ status: 404, description: '资源未找到' }) // 如果适用
```

### 3. 路径参数（如果有）

```typescript
@ApiParam({ name: 'id', description: '患者ID' })
```

### 4. 查询参数（如果有）

```typescript
@ApiQuery({ name: 'page', description: '页码', required: false })
@ApiQuery({ name: 'limit', description: '每页记录数', required: false })
```

## 示例

### 患者管理 API

```typescript
@ApiTags('牙科诊所管理', '患者管理')
@ApiOperation({ summary: '获取患者列表', description: '获取所有患者的列表，支持分页和过滤' })
@ApiResponse({ status: 200, description: '成功返回患者列表' })
@Get('patients')
async getPatients(@Query() query: PatientQueryDto) {
  return this.dentalService.getPatients(query);
}

@ApiTags('牙科诊所管理', '患者管理')
@ApiOperation({ summary: '创建新患者' })
@ApiResponse({ status: 201, description: '成功创建患者' })
@Post('patients')
async createPatient(@Body() patientData: CreatePatientDto) {
  return this.dentalService.createPatient(patientData);
}
```

### 预约管理 API

```typescript
@ApiTags('牙科诊所管理', '预约管理')
@ApiOperation({ summary: '获取预约列表', description: '获取所有预约的列表，支持分页和过滤' })
@ApiResponse({ status: 200, description: '成功返回预约列表' })
@Get('appointments')
async getAppointments(@Query() query: AppointmentQueryDto) {
  return this.dentalService.getAppointments(query);
}
```

### 库存管理 API

库存管理 API 使用专门的控制器 `InventoryController`，基础路径为 `dental/inventory`。

```typescript
@ApiTags('牙科诊所管理', '库存管理')
@Controller('dental/inventory')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly dentalService: DentalService) {}
  
  @ApiOperation({ summary: '获取库存列表', description: '获取库存列表，支持分页、筛选' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @Get()
  async getInventoryList(@Query() query: InventoryQueryDto) {
    return this.dentalService.getInventoryList(query);
  }
  
  @ApiOperation({ summary: '创建入库记录', description: '创建入库记录并更新库存数量' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 404, description: '库存物品不存在' })
  @Post('in-records')
  async createInRecord(@Body() createInRecordDto: CreateInventoryInRecordDto) {
    return this.dentalService.createInventoryInRecord(createInRecordDto);
  }
  
  @ApiOperation({ summary: '创建出库记录', description: '创建出库记录并减少库存数量' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '库存不足' })
  @ApiResponse({ status: 404, description: '库存物品不存在' })
  @Post('out-records')
  async createOutRecord(@Body() createOutRecordDto: CreateInventoryOutRecordDto) {
    return this.dentalService.createInventoryOutRecord(createOutRecordDto);
  }
}
```

### 库存盘点 API

```typescript
@ApiTags('牙科诊所管理', '库存管理')
@ApiOperation({ summary: '获取库存盘点列表', description: '获取库存盘点记录列表，支持分页和筛选' })
@ApiResponse({ status: 200, description: '获取成功' })
@Get('stock-takes')
async getStockTakeList(@Query() query: StockTakeQueryDto) {
  return this.dentalService.getStockTakeList(query);
}

@ApiTags('牙科诊所管理', '库存管理')
@ApiOperation({ summary: '获取盘点记录详情', description: '根据ID获取盘点记录详情，包括所有盘点项目' })
@ApiResponse({ status: 200, description: '获取成功' })
@ApiResponse({ status: 404, description: '盘点记录不存在' })
@ApiParam({ name: 'id', description: '盘点记录ID' })
@Get('stock-takes/:id')
async getStockTake(@Param('id') id: string) {
  return this.dentalService.getStockTake(id);
}

@ApiTags('牙科诊所管理', '库存管理')
@ApiOperation({ summary: '创建盘点记录', description: '创建新的盘点记录，包括盘点项目' })
@ApiResponse({ status: 201, description: '创建成功' })
@ApiResponse({ status: 404, description: '库存物品不存在' })
@Post('stock-takes')
async createStockTake(@Body() createStockTakeDto: CreateStockTakeDto) {
  return this.dentalService.createStockTake(createStockTakeDto);
}

@ApiTags('牙科诊所管理', '库存管理')
@ApiOperation({ summary: '删除盘点记录', description: '删除指定的盘点记录' })
@ApiResponse({ status: 200, description: '删除成功' })
@ApiResponse({ status: 404, description: '盘点记录不存在' })
@ApiParam({ name: 'id', description: '盘点记录ID' })
@Delete('stock-takes/:id')
async deleteStockTake(@Param('id') id: string) {
  return this.dentalService.deleteStockTake(id);
}
```

## DTO 类装饰器

为确保 Swagger UI 显示正确的请求体和响应体结构，所有 DTO 类都应使用以下装饰器：

```typescript
export class CreatePatientDto {
  @ApiProperty({ description: '患者姓名' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '患者性别', enum: ['男', '女', '其他'] })
  @IsEnum(['男', '女', '其他'])
  gender: string;

  @ApiProperty({ description: '患者年龄', example: 30 })
  @IsNumber()
  @IsOptional()
  age?: number;

  @ApiProperty({ description: '患者电话号码' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
```

### 库存相关 DTO 示例

```typescript
export class CreateInventoryDto {
  @ApiProperty({ description: '物品名称' })
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @ApiProperty({ description: '物品编码', example: 'ITEM-001' })
  @IsString()
  @IsNotEmpty()
  code: string;
  
  @ApiProperty({ 
    description: '物品类型', 
    enum: ['material', 'medicine', 'equipment', 'tool', 'other'],
    example: 'material'
  })
  @IsEnum(['material', 'medicine', 'equipment', 'tool', 'other'])
  type: string;
  
  @ApiProperty({ description: '规格', example: '100ml/瓶' })
  @IsString()
  specification: string;
  
  @ApiProperty({ description: '单位', example: '瓶' })
  @IsString()
  unit: string;
  
  @ApiProperty({ description: '安全库存量', example: 10 })
  @IsNumber()
  safetyQuantity: number;
}

export class CreateInventoryInRecordDto {
  @ApiProperty({ description: '关联库存ID' })
  @IsUUID()
  inventoryId: string;
  
  @ApiProperty({ description: '入库数量', example: 5 })
  @IsNumber()
  @Min(1)
  quantity: number;
  
  @ApiProperty({ 
    description: '入库类型', 
    enum: ['purchase', 'return', 'transfer', 'other'],
    example: 'purchase'
  })
  @IsEnum(['purchase', 'return', 'transfer', 'other'])
  type: string;
  
  @ApiProperty({ description: '生产日期', required: false })
  @IsDate()
  @IsOptional()
  productionDate?: Date;
  
  @ApiProperty({ description: '有效期至', required: false })
  @IsDate()
  @IsOptional()
  expirationDate?: Date;
}
```

### 库存盘点相关 DTO 示例

```typescript
export class InventoryStockTakeItemDto {
  @ApiProperty({ description: '关联库存ID' })
  @IsUUID()
  inventoryId: string;
  
  @ApiProperty({ description: '实际盘点数量', example: 48 })
  @IsNumber()
  @Min(0)
  actualQuantity: number;
  
  @ApiProperty({ description: '差异原因', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class CreateStockTakeDto {
  @ApiProperty({ description: '盘点批次号', example: 'ST202407120001' })
  @IsString()
  @IsNotEmpty()
  batchNumber: string;
  
  @ApiProperty({ description: '盘点日期', example: '2024-07-12' })
  @IsDateString()
  stockTakeDate: string;
  
  @ApiProperty({ description: '操作员', example: '李医生' })
  @IsString()
  @IsNotEmpty()
  operator: string;
  
  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
  
  @ApiProperty({ 
    description: '盘点项目列表',
    type: [InventoryStockTakeItemDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InventoryStockTakeItemDto)
  items: InventoryStockTakeItemDto[];
}

export class StockTakeQueryDto {
  @ApiProperty({ description: '页码', default: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;
  
  @ApiProperty({ description: '每页记录数', default: 10 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 10;
  
  @ApiProperty({ description: '开始日期', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;
  
  @ApiProperty({ description: '结束日期', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;
  
  @ApiProperty({ description: '操作员', required: false })
  @IsString()
  @IsOptional()
  operator?: string;
  
  @ApiProperty({ description: '批次号', required: false })
  @IsString()
  @IsOptional()
  batchNumber?: string;
}
```

## 常见问题及解决方案

### 新端点未显示在 Swagger UI 中

检查以下几点：

1. 确保控制器类和方法都有适当的 Swagger 装饰器
2. 检查 DTO 类是否正确导入并使用了 `@ApiProperty` 装饰器
3. 确保控制器已在模块的 `controllers` 数组中注册
4. 验证 `main.ts` 中的 Swagger 配置是否正确

### 在 Swagger UI 中进行身份验证

1. 在 Swagger UI 界面顶部找到"Authorize"按钮
2. 输入您的 JWT 令牌（不需要添加 "Bearer " 前缀）
3. 点击"Authorize"按钮完成认证

## 最佳实践

1. **保持一致性**：对同类 API 使用相同的标签和命名模式
2. **详细描述参数**：为每个参数提供清晰的描述、示例值和可能的限制
3. **完整的响应描述**：描述所有可能的响应状态码及其含义
4. **使用枚举**：当参数有固定选项时，使用枚举类型并在文档中说明
5. **分组相关 API**：使用相同的标签分组功能相关的 API

## 添加新 API 端点检查清单

添加新 API 端点时，请确保：

- [ ] 添加了 `@ApiTags` 装饰器，指定正确的分类
- [ ] 添加了 `@ApiOperation` 装饰器，提供摘要和描述
- [ ] 添加了 `@ApiResponse` 装饰器，描述可能的响应状态
- [ ] 如有路径参数，添加了 `@ApiParam` 装饰器
- [ ] 如有查询参数，添加了 `@ApiQuery` 装饰器或使用带有 `@ApiProperty` 装饰器的 DTO 类
- [ ] 请求体 DTO 类的所有属性都有 `@ApiProperty` 装饰器
- [ ] 控制器已在模块中正确注册

## 测试相关

- 所有API自动化测试脚本位于 `src/test/` 目录下
- 在添加新API后，请同时更新相应的测试脚本
- 测试脚本可以通过 `npm run test:api` 命令运行
- API文档访问地址: `http://localhost:3000/api/docs` 