import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { InventoryService } from './inventory.service';
import {
  CreateInventoryDto,
  UpdateInventoryDto,
  InventoryQueryDto,
  BatchImportInventoryDto,
  LowInventoryQueryDto,
} from './dto/inventory.dto';
import {
  CreateInventoryInRecordDto,
  InventoryInRecordQueryDto,
} from './dto/inventory-in-record.dto';
import {
  CreateInventoryOutRecordDto,
  InventoryOutRecordQueryDto,
} from './dto/inventory-out-record.dto';
import { CreateStockTakeDto, StockTakeQueryDto } from './dto/stock-take.dto';

@ApiTags('库存管理')
@Controller('dental/inventory')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // 库存项管理
  @ApiOperation({
    summary: '获取库存列表',
    description: '获取库存列表，支持分页、筛选',
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  @Get()
  async getInventoryList(@Query() query: InventoryQueryDto) {
    return this.inventoryService.getInventoryList(query);
  }

  @ApiOperation({
    summary: '获取低库存预警列表',
    description: '获取库存不足或低于安全库存的物品列表',
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  @Get('warnings')
  async getLowInventoryList(@Query() query: LowInventoryQueryDto) {
    return this.inventoryService.getLowInventoryList(query);
  }

  @ApiOperation({ summary: '获取库存详情', description: '根据ID获取库存详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '库存不存在' })
  @Get(':id')
  async getInventory(@Param('id') id: string) {
    return this.inventoryService.getInventory(id);
  }

  @ApiOperation({ summary: '新增库存项', description: '新增库存项' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @Post()
  async createInventory(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.createInventory(createInventoryDto);
  }

  @ApiOperation({ summary: '批量导入库存', description: '批量导入多个库存项' })
  @ApiResponse({ status: 201, description: '导入成功' })
  @ApiResponse({ status: 400, description: '请求数据验证失败' })
  @Post('batch-import')
  async batchImportInventory(@Body() batchImportDto: BatchImportInventoryDto) {
    return this.inventoryService.batchImportInventory(batchImportDto);
  }

  @ApiOperation({ summary: '更新库存项', description: '根据ID更新库存项' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '库存不存在' })
  @Put(':id')
  async updateInventory(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.updateInventory(id, updateInventoryDto);
  }

  @ApiOperation({ summary: '删除库存项', description: '根据ID删除库存项' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '库存不存在' })
  @Delete(':id')
  async deleteInventory(@Param('id') id: string) {
    return this.inventoryService.deleteInventory(id);
  }

  // 入库记录管理
  @ApiOperation({
    summary: '获取入库记录列表',
    description: '获取入库记录，支持分页、筛选',
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  @Get('records/in/list')
  async getInRecordsList(@Query() query: InventoryInRecordQueryDto) {
    return this.inventoryService.getInventoryInRecords(query);
  }

  @ApiOperation({ summary: '创建入库记录', description: '创建入库记录' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @Post('in-records')
  async createInRecord(@Body() createInRecordDto: CreateInventoryInRecordDto) {
    return this.inventoryService.createInventoryInRecord(createInRecordDto);
  }

  @ApiOperation({
    summary: '获取入库记录详情',
    description: '根据ID获取入库记录详情',
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '记录不存在' })
  @Get('in-records/:id')
  async getInRecord(@Param('id') id: string) {
    return this.inventoryService.getInventoryInRecord(id);
  }

  @ApiOperation({ summary: '删除入库记录', description: '根据ID删除入库记录' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '记录不存在' })
  @Delete('in-records/:id')
  async deleteInRecord(@Param('id') id: string) {
    return this.inventoryService.deleteInventoryInRecord(id);
  }

  // 出库记录管理
  @ApiOperation({
    summary: '获取出库记录列表',
    description: '获取出库记录，支持分页、筛选',
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  @Get('records/out/list')
  async getOutRecordsList(@Query() query: InventoryOutRecordQueryDto) {
    return this.inventoryService.getInventoryOutRecords(query);
  }

  @ApiOperation({ summary: '创建出库记录', description: '创建出库记录' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @Post('out-records')
  async createOutRecord(
    @Body() createOutRecordDto: CreateInventoryOutRecordDto,
  ) {
    return this.inventoryService.createInventoryOutRecord(createOutRecordDto);
  }

  @ApiOperation({
    summary: '获取出库记录详情',
    description: '根据ID获取出库记录详情',
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '记录不存在' })
  @Get('out-records/:id')
  async getOutRecord(@Param('id') id: string) {
    return this.inventoryService.getInventoryOutRecord(id);
  }

  @ApiOperation({ summary: '删除出库记录', description: '根据ID删除出库记录' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '记录不存在' })
  @Delete('out-records/:id')
  async deleteOutRecord(@Param('id') id: string) {
    return this.inventoryService.deleteInventoryOutRecord(id);
  }

  // 库存统计
  @ApiOperation({
    summary: '获取库存统计信息',
    description: '获取库存状态统计，如预警、库存不足等',
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  @Get('stats')
  async getInventoryStatistics() {
    return this.inventoryService.getInventoryStatistics();
  }

  // 库存盘点管理
  @ApiOperation({
    summary: '获取库存盘点记录列表',
    description: '获取库存盘点记录，支持分页、筛选',
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  @Get('stock-takes')
  async getStockTakeList(@Query() query: StockTakeQueryDto) {
    return this.inventoryService.getStockTakeList(query);
  }

  @ApiOperation({
    summary: '获取库存盘点详情',
    description: '根据ID获取库存盘点详情',
  })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '盘点记录不存在' })
  @Get('stock-takes/:id')
  async getStockTake(@Param('id') id: string) {
    return this.inventoryService.getStockTake(id);
  }

  @ApiOperation({ summary: '创建库存盘点', description: '创建库存盘点记录' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @Post('stock-takes')
  async createStockTake(@Body() createStockTakeDto: CreateStockTakeDto) {
    return this.inventoryService.createStockTake(createStockTakeDto);
  }

  @ApiOperation({
    summary: '删除库存盘点记录',
    description: '根据ID删除库存盘点记录',
  })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '盘点记录不存在' })
  @Delete('stock-takes/:id')
  async deleteStockTake(@Param('id') id: string) {
    return this.inventoryService.deleteStockTake(id);
  }
}
