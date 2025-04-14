import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DentalService } from './dental.service';
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto } from './dto/patient.dto';
import { CreateAppointmentDto, UpdateAppointmentDto, AppointmentQueryDto } from './dto/appointment.dto';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto, MedicalRecordQueryDto } from './dto/medical-record.dto';
import { CreateFollowupDto, UpdateFollowupDto, FollowupQueryDto } from './dto/followup.dto';
import { CreateInventoryDto, UpdateInventoryDto, InventoryQueryDto } from './dto/inventory.dto';
import { CreateInventoryInRecordDto, InventoryInRecordQueryDto } from './dto/inventory-in-record.dto';
import { CreateInventoryOutRecordDto, InventoryOutRecordQueryDto } from './dto/inventory-out-record.dto';

/**
 * 牙科诊所管理API控制器
 */
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dental')
export class DentalController {
  constructor(private readonly dentalService: DentalService) {}

  /* 患者管理API */
  @ApiTags('牙科诊所管理', '患者管理')
  @ApiOperation({ summary: '获取患者列表' })
  @ApiResponse({ status: 200, description: '成功返回患者列表' })
  @Get('patients')
  async getPatients(@Query() query: PatientQueryDto) {
    return this.dentalService.getPatients(query);
  }

  @ApiTags('牙科诊所管理', '患者管理')
  @ApiOperation({ summary: '获取患者详情' })
  @ApiParam({ name: 'id', description: '患者ID' })
  @ApiResponse({ status: 200, description: '成功返回患者详情' })
  @Get('patients/:id')
  async getPatient(@Param('id') id: string) {
    return this.dentalService.getPatient(id);
  }

  @ApiTags('牙科诊所管理', '患者管理')
  @ApiOperation({ summary: '创建新患者' })
  @ApiResponse({ status: 201, description: '成功创建患者' })
  @Post('patients')
  async createPatient(@Body() patientData: CreatePatientDto) {
    return this.dentalService.createPatient(patientData);
  }

  @ApiTags('牙科诊所管理', '患者管理')
  @ApiOperation({ summary: '更新患者信息' })
  @ApiParam({ name: 'id', description: '患者ID' })
  @ApiResponse({ status: 200, description: '成功更新患者信息' })
  @Put('patients/:id')
  async updatePatient(@Param('id') id: string, @Body() patientData: UpdatePatientDto) {
    return this.dentalService.updatePatient(id, patientData);
  }

  @ApiTags('牙科诊所管理', '患者管理')
  @ApiOperation({ summary: '删除患者' })
  @ApiParam({ name: 'id', description: '患者ID' })
  @ApiResponse({ status: 200, description: '成功删除患者' })
  @Delete('patients/:id')
  async deletePatient(@Param('id') id: string) {
    return this.dentalService.deletePatient(id);
  }

  /* 预约管理API */
  @ApiTags('牙科诊所管理', '预约管理')
  @ApiOperation({ summary: '获取预约列表' })
  @ApiResponse({ status: 200, description: '成功返回预约列表' })
  @Get('appointments')
  async getAppointments(@Query() query: AppointmentQueryDto) {
    return this.dentalService.getAppointments(query);
  }

  @ApiTags('牙科诊所管理', '预约管理')
  @ApiOperation({ summary: '获取指定日期的预约' })
  @ApiParam({ name: 'date', description: '日期 (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: '成功返回预约列表' })
  @Get('appointments/date/:date')
  async getAppointmentsByDate(@Param('date') date: string) {
    return this.dentalService.getAppointmentsByDate(date);
  }

  @ApiTags('牙科诊所管理', '预约管理')
  @ApiOperation({ summary: '创建新预约' })
  @ApiResponse({ status: 201, description: '成功创建预约' })
  @Post('appointments')
  async createAppointment(@Body() appointmentData: CreateAppointmentDto) {
    return this.dentalService.createAppointment(appointmentData);
  }

  @ApiTags('牙科诊所管理', '预约管理')
  @ApiOperation({ summary: '更新预约信息' })
  @ApiParam({ name: 'id', description: '预约ID' })
  @ApiResponse({ status: 200, description: '成功更新预约信息' })
  @Put('appointments/:id')
  async updateAppointment(
    @Param('id') id: string,
    @Body() appointmentData: UpdateAppointmentDto,
  ) {
    return this.dentalService.updateAppointment(id, appointmentData);
  }

  @ApiTags('牙科诊所管理', '预约管理')
  @ApiOperation({ summary: '取消/删除预约' })
  @ApiParam({ name: 'id', description: '预约ID' })
  @ApiResponse({ status: 200, description: '成功取消预约' })
  @Delete('appointments/:id')
  async deleteAppointment(@Param('id') id: string) {
    return this.dentalService.deleteAppointment(id);
  }

  /* 病历记录API */
  @ApiTags('牙科诊所管理', '病历管理')
  @ApiOperation({ summary: '获取患者病历列表' })
  @ApiParam({ name: 'patientId', description: '患者ID' })
  @ApiResponse({ status: 200, description: '成功返回病历列表' })
  @Get('patients/:patientId/records')
  async getMedicalRecords(
    @Param('patientId') patientId: string,
    @Query() query: MedicalRecordQueryDto,
  ) {
    return this.dentalService.getMedicalRecords(patientId, query);
  }

  @ApiTags('牙科诊所管理', '病历管理')
  @ApiOperation({ summary: '创建患者病历' })
  @ApiParam({ name: 'patientId', description: '患者ID' })
  @ApiResponse({ status: 201, description: '成功创建病历' })
  @Post('patients/:patientId/records')
  async createMedicalRecord(
    @Param('patientId') patientId: string,
    @Body() recordData: CreateMedicalRecordDto,
  ) {
    return this.dentalService.createMedicalRecord(patientId, recordData);
  }

  @ApiTags('牙科诊所管理', '病历管理')
  @ApiOperation({ summary: '更新病历信息' })
  @ApiParam({ name: 'id', description: '病历ID' })
  @ApiResponse({ status: 200, description: '成功更新病历信息' })
  @Put('records/:id')
  async updateMedicalRecord(@Param('id') id: string, @Body() recordData: UpdateMedicalRecordDto) {
    return this.dentalService.updateMedicalRecord(id, recordData);
  }

  @ApiTags('牙科诊所管理', '病历管理')
  @ApiOperation({ summary: '删除病历' })
  @ApiParam({ name: 'id', description: '病历ID' })
  @ApiResponse({ status: 200, description: '成功删除病历' })
  @Delete('records/:id')
  async deleteMedicalRecord(@Param('id') id: string) {
    return this.dentalService.deleteMedicalRecord(id);
  }

  /* 复诊记录API */
  @ApiTags('牙科诊所管理', '随访管理')
  @ApiOperation({ summary: '获取患者复诊记录列表' })
  @ApiParam({ name: 'patientId', description: '患者ID' })
  @ApiResponse({ status: 200, description: '成功返回复诊记录列表' })
  @Get('patients/:patientId/followups')
  async getFollowups(
    @Param('patientId') patientId: string,
    @Query() query: FollowupQueryDto,
  ) {
    return this.dentalService.getFollowups(patientId, query);
  }

  @ApiTags('牙科诊所管理', '随访管理')
  @ApiOperation({ summary: '创建患者复诊记录' })
  @ApiParam({ name: 'patientId', description: '患者ID' })
  @ApiResponse({ status: 201, description: '成功创建复诊记录' })
  @Post('patients/:patientId/followups')
  async createFollowup(
    @Param('patientId') patientId: string,
    @Body() followupData: CreateFollowupDto,
  ) {
    return this.dentalService.createFollowup(patientId, followupData);
  }

  @ApiTags('牙科诊所管理', '随访管理')
  @ApiOperation({ summary: '更新复诊记录信息' })
  @ApiParam({ name: 'id', description: '复诊记录ID' })
  @ApiResponse({ status: 200, description: '成功更新复诊记录信息' })
  @Put('followups/:id')
  async updateFollowup(@Param('id') id: string, @Body() followupData: UpdateFollowupDto) {
    return this.dentalService.updateFollowup(id, followupData);
  }

  @ApiTags('牙科诊所管理', '随访管理')
  @ApiOperation({ summary: '删除复诊记录' })
  @ApiParam({ name: 'id', description: '复诊记录ID' })
  @ApiResponse({ status: 200, description: '成功删除复诊记录' })
  @Delete('followups/:id')
  async deleteFollowup(@Param('id') id: string) {
    return this.dentalService.deleteFollowup(id);
  }

  /* 库存管理API */
  @ApiTags('牙科诊所管理', '库存管理')
  @ApiOperation({ summary: '获取库存物品列表', description: '获取所有库存物品的列表，支持分页和过滤' })
  @ApiResponse({ status: 200, description: '成功获取库存物品列表' })
  @Get('inventory')
  async getInventoryList(@Query() query: InventoryQueryDto) {
    return this.dentalService.getInventoryList(query);
  }

  @ApiTags('牙科诊所管理', '库存管理')
  @ApiOperation({ summary: '获取库存物品详情', description: '根据ID获取单个库存物品的详细信息' })
  @ApiParam({ name: 'id', description: '库存物品ID' })
  @ApiResponse({ status: 200, description: '成功获取库存物品详情' })
  @ApiResponse({ status: 404, description: '库存物品不存在' })
  @Get('inventory/:id')
  async getInventory(@Param('id') id: string) {
    return this.dentalService.getInventory(id);
  }

  @ApiTags('牙科诊所管理', '库存管理')
  @ApiOperation({ summary: '创建库存物品', description: '创建新的库存物品' })
  @ApiResponse({ status: 201, description: '成功创建库存物品' })
  @Post('inventory')
  async createInventory(@Body() inventoryData: CreateInventoryDto) {
    return this.dentalService.createInventory(inventoryData);
  }

  @ApiTags('牙科诊所管理', '库存管理')
  @ApiOperation({ summary: '更新库存物品', description: '根据ID更新库存物品信息' })
  @ApiParam({ name: 'id', description: '库存物品ID' })
  @ApiResponse({ status: 200, description: '成功更新库存物品' })
  @ApiResponse({ status: 404, description: '库存物品不存在' })
  @Put('inventory/:id')
  async updateInventory(@Param('id') id: string, @Body() inventoryData: UpdateInventoryDto) {
    return this.dentalService.updateInventory(id, inventoryData);
  }

  @ApiTags('牙科诊所管理', '库存管理')
  @ApiOperation({ summary: '删除库存物品', description: '根据ID删除库存物品' })
  @ApiParam({ name: 'id', description: '库存物品ID' })
  @ApiResponse({ status: 200, description: '成功删除库存物品' })
  @ApiResponse({ status: 404, description: '库存物品不存在' })
  @Delete('inventory/:id')
  async deleteInventory(@Param('id') id: string) {
    return this.dentalService.deleteInventory(id);
  }

  /* 库存统计API */
  @ApiTags('牙科诊所管理', '库存管理')
  @ApiOperation({ summary: '获取库存统计信息', description: '获取库存的统计信息，如总数量、库存预警、过期预警等' })
  @ApiResponse({ status: 200, description: '成功获取库存统计信息' })
  @Get('inventory/statistics/summary')
  async getInventoryStatistics() {
    return this.dentalService.getInventoryStatistics();
  }

  /* 入库记录API */
  @ApiTags('牙科诊所管理', '库存管理')
  @ApiOperation({ summary: '获取入库记录列表', description: '获取所有入库记录的列表，支持分页和过滤' })
  @ApiResponse({ status: 200, description: '成功获取入库记录列表' })
  @Get('inventory/in-records')
  async getInventoryInRecords(@Query() query: InventoryInRecordQueryDto) {
    return this.dentalService.getInventoryInRecords(query);
  }

  @ApiTags('牙科诊所管理', '库存管理')
  @ApiOperation({ summary: '创建入库记录', description: '创建新的入库记录' })
  @ApiResponse({ status: 201, description: '成功创建入库记录' })
  @Post('inventory/in-records')
  async createInventoryInRecord(@Body() inRecordData: CreateInventoryInRecordDto) {
    return this.dentalService.createInventoryInRecord(inRecordData);
  }

  @ApiTags('牙科诊所管理', '库存管理')
  @ApiOperation({ summary: '获取入库记录详情', description: '根据ID获取单个入库记录的详细信息' })
  @ApiParam({ name: 'id', description: '入库记录ID' })
  @ApiResponse({ status: 200, description: '成功获取入库记录详情' })
  @ApiResponse({ status: 404, description: '入库记录不存在' })
  @Get('inventory/in-records/:id')
  async getInventoryInRecord(@Param('id') id: string) {
    return this.dentalService.getInventoryInRecord(id);
  }

  @ApiTags('牙科诊所管理', '库存管理')
  @ApiOperation({ summary: '删除入库记录', description: '根据ID删除入库记录' })
  @ApiParam({ name: 'id', description: '入库记录ID' })
  @ApiResponse({ status: 200, description: '成功删除入库记录' })
  @ApiResponse({ status: 404, description: '入库记录不存在' })
  @Delete('inventory/in-records/:id')
  async deleteInventoryInRecord(@Param('id') id: string) {
    return this.dentalService.deleteInventoryInRecord(id);
  }

  /* 出库记录API */
  @ApiTags('牙科诊所管理', '库存管理')
  @ApiOperation({ summary: '获取出库记录列表', description: '获取所有出库记录的列表，支持分页和过滤' })
  @ApiResponse({ status: 200, description: '成功获取出库记录列表' })
  @Get('inventory/out-records')
  async getInventoryOutRecords(@Query() query: InventoryOutRecordQueryDto) {
    return this.dentalService.getInventoryOutRecords(query);
  }

  @ApiTags('牙科诊所管理', '库存管理')
  @ApiOperation({ summary: '创建出库记录', description: '创建新的出库记录' })
  @ApiResponse({ status: 201, description: '成功创建出库记录' })
  @Post('inventory/out-records')
  async createInventoryOutRecord(@Body() outRecordData: CreateInventoryOutRecordDto) {
    return this.dentalService.createInventoryOutRecord(outRecordData);
  }

  @ApiTags('牙科诊所管理', '库存管理')
  @ApiOperation({ summary: '获取出库记录详情', description: '根据ID获取单个出库记录的详细信息' })
  @ApiParam({ name: 'id', description: '出库记录ID' })
  @ApiResponse({ status: 200, description: '成功获取出库记录详情' })
  @ApiResponse({ status: 404, description: '出库记录不存在' })
  @Get('inventory/out-records/:id')
  async getInventoryOutRecord(@Param('id') id: string) {
    return this.dentalService.getInventoryOutRecord(id);
  }

  @ApiTags('牙科诊所管理', '库存管理')
  @ApiOperation({ summary: '删除出库记录', description: '根据ID删除出库记录' })
  @ApiParam({ name: 'id', description: '出库记录ID' })
  @ApiResponse({ status: 200, description: '成功删除出库记录' })
  @ApiResponse({ status: 404, description: '出库记录不存在' })
  @Delete('inventory/out-records/:id')
  async deleteInventoryOutRecord(@Param('id') id: string) {
    return this.dentalService.deleteInventoryOutRecord(id);
  }
}
