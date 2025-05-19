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
import {
  CreatePatientDto,
  UpdatePatientDto,
  PatientQueryDto,
} from './patient/dto/patient.dto';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  AppointmentQueryDto,
} from './appointment/dto/appointment.dto';
import {
  CreateMedicalRecordDto,
  UpdateMedicalRecordDto,
  MedicalRecordQueryDto,
} from './dto/medical-record.dto';
import {
  CreateFollowupDto,
  UpdateFollowupDto,
  FollowupQueryDto,
} from './dto/followup.dto';

/**
 * 牙科诊所管理控制器
 */
@ApiTags('牙科诊所')
@Controller('dental')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DentalController {
  constructor(private readonly dentalService: DentalService) {}

  /* 患者管理API */
  @ApiTags('牙科诊所管理', '患者管理')
  @ApiOperation({
    summary: '获取患者列表',
    description: '获取患者列表，支持分页、筛选',
  })
  @ApiResponse({ status: 200, description: '成功返回患者列表' })
  @Get('patients')
  async getPatients(@Query() query: PatientQueryDto) {
    return this.dentalService.getPatients(query);
  }

  @ApiTags('牙科诊所管理', '患者管理')
  @ApiOperation({ summary: '获取患者详情', description: '根据ID获取患者详情' })
  @ApiResponse({ status: 200, description: '成功返回患者信息' })
  @ApiResponse({ status: 404, description: '患者不存在' })
  @Get('patients/:id')
  async getPatient(@Param('id') id: string) {
    return this.dentalService.getPatient(id);
  }

  @ApiTags('牙科诊所管理', '患者管理')
  @ApiOperation({ summary: '创建新患者', description: '创建新患者记录' })
  @ApiResponse({ status: 201, description: '成功创建患者' })
  @Post('patients')
  async createPatient(@Body() patientData: CreatePatientDto) {
    return this.dentalService.createPatient(patientData);
  }

  @ApiTags('牙科诊所管理', '患者管理')
  @ApiOperation({ summary: '更新患者信息', description: '根据ID更新患者信息' })
  @ApiResponse({ status: 200, description: '成功更新患者信息' })
  @ApiResponse({ status: 404, description: '患者不存在' })
  @Put('patients/:id')
  async updatePatient(
    @Param('id') id: string,
    @Body() patientData: UpdatePatientDto,
  ) {
    return this.dentalService.updatePatient(id, patientData);
  }

  @ApiTags('牙科诊所管理', '患者管理')
  @ApiOperation({ summary: '删除患者', description: '根据ID删除患者' })
  @ApiResponse({ status: 200, description: '成功删除患者' })
  @ApiResponse({ status: 404, description: '患者不存在' })
  @Delete('patients/:id')
  async deletePatient(@Param('id') id: string) {
    return this.dentalService.deletePatient(id);
  }

  /* 预约管理API */
  @ApiTags('牙科诊所管理', '预约管理')
  @ApiOperation({
    summary: '获取预约列表',
    description: '获取预约列表，支持分页、筛选',
  })
  @ApiResponse({ status: 200, description: '成功返回预约列表' })
  @Get('appointments')
  async getAppointments(@Query() query: AppointmentQueryDto) {
    return this.dentalService.getAppointments(query);
  }

  @ApiTags('牙科诊所管理', '预约管理')
  @ApiOperation({ summary: '获取某日预约', description: '获取指定日期的预约' })
  @ApiResponse({ status: 200, description: '成功返回指定日期的预约列表' })
  @Get('appointments/date/:date')
  async getAppointmentsByDate(@Param('date') date: string) {
    return this.dentalService.getAppointmentsByDate(date);
  }

  @ApiTags('牙科诊所管理', '预约管理')
  @ApiOperation({ summary: '创建新预约', description: '创建新预约' })
  @ApiResponse({ status: 201, description: '成功创建预约' })
  @Post('appointments')
  async createAppointment(@Body() appointmentData: CreateAppointmentDto) {
    return this.dentalService.createAppointment(appointmentData);
  }

  @ApiTags('牙科诊所管理', '预约管理')
  @ApiOperation({ summary: '更新预约', description: '根据ID更新预约信息' })
  @ApiResponse({ status: 200, description: '成功更新预约信息' })
  @ApiResponse({ status: 404, description: '预约不存在' })
  @Put('appointments/:id')
  async updateAppointment(
    @Param('id') id: string,
    @Body() appointmentData: UpdateAppointmentDto,
  ) {
    return this.dentalService.updateAppointment(id, appointmentData);
  }

  @ApiTags('牙科诊所管理', '预约管理')
  @ApiOperation({ summary: '删除预约', description: '根据ID删除预约' })
  @ApiResponse({ status: 200, description: '成功删除预约' })
  @ApiResponse({ status: 404, description: '预约不存在' })
  @Delete('appointments/:id')
  async deleteAppointment(@Param('id') id: string) {
    return this.dentalService.deleteAppointment(id);
  }

  /* 病历记录API */
  @ApiTags('牙科诊所管理', '病历管理')
  @ApiOperation({
    summary: '获取患者病历',
    description: '获取指定患者的病历记录，支持分页',
  })
  @ApiResponse({ status: 200, description: '成功返回病历列表' })
  @Get('patients/:patientId/records')
  async getMedicalRecords(
    @Param('patientId') patientId: string,
    @Query() query: MedicalRecordQueryDto,
  ) {
    return this.dentalService.getMedicalRecords(patientId, query);
  }

  @ApiTags('牙科诊所管理', '病历管理')
  @ApiOperation({ summary: '创建病历', description: '为指定患者创建病历记录' })
  @ApiResponse({ status: 201, description: '成功创建病历' })
  @Post('patients/:patientId/records')
  async createMedicalRecord(
    @Param('patientId') patientId: string,
    @Body() recordData: CreateMedicalRecordDto,
  ) {
    return this.dentalService.createMedicalRecord(patientId, recordData);
  }

  @ApiTags('牙科诊所管理', '病历管理')
  @ApiOperation({ summary: '更新病历', description: '根据ID更新病历信息' })
  @ApiResponse({ status: 200, description: '成功更新病历信息' })
  @ApiResponse({ status: 404, description: '病历不存在' })
  @Put('records/:id')
  async updateMedicalRecord(
    @Param('id') id: string,
    @Body() recordData: UpdateMedicalRecordDto,
  ) {
    return this.dentalService.updateMedicalRecord(id, recordData);
  }

  @ApiTags('牙科诊所管理', '病历管理')
  @ApiOperation({ summary: '删除病历', description: '根据ID删除病历' })
  @ApiResponse({ status: 200, description: '成功删除病历' })
  @ApiResponse({ status: 404, description: '病历不存在' })
  @Delete('records/:id')
  async deleteMedicalRecord(@Param('id') id: string) {
    return this.dentalService.deleteMedicalRecord(id);
  }

  /* 复诊记录API */
  @ApiTags('牙科诊所管理', '随访管理')
  @ApiOperation({
    summary: '获取患者随访记录',
    description: '获取指定患者的随访记录，支持分页',
  })
  @ApiResponse({ status: 200, description: '成功返回随访记录列表' })
  @Get('patients/:patientId/followups')
  async getFollowups(
    @Param('patientId') patientId: string,
    @Query() query: FollowupQueryDto,
  ) {
    return this.dentalService.getFollowups(patientId, query);
  }

  @ApiTags('牙科诊所管理', '随访管理')
  @ApiOperation({
    summary: '创建随访记录',
    description: '为指定患者创建随访记录',
  })
  @ApiResponse({ status: 201, description: '成功创建随访记录' })
  @Post('patients/:patientId/followups')
  async createFollowup(
    @Param('patientId') patientId: string,
    @Body() followupData: CreateFollowupDto,
  ) {
    return this.dentalService.createFollowup(patientId, followupData);
  }

  @ApiTags('牙科诊所管理', '随访管理')
  @ApiOperation({
    summary: '更新随访记录',
    description: '根据ID更新随访记录信息',
  })
  @ApiResponse({ status: 200, description: '成功更新随访记录信息' })
  @ApiResponse({ status: 404, description: '随访记录不存在' })
  @Put('followups/:id')
  async updateFollowup(
    @Param('id') id: string,
    @Body() followupData: UpdateFollowupDto,
  ) {
    return this.dentalService.updateFollowup(id, followupData);
  }

  @ApiTags('牙科诊所管理', '随访管理')
  @ApiOperation({ summary: '删除随访记录', description: '根据ID删除随访记录' })
  @ApiResponse({ status: 200, description: '成功删除随访记录' })
  @ApiResponse({ status: 404, description: '随访记录不存在' })
  @Delete('followups/:id')
  async deleteFollowup(@Param('id') id: string) {
    return this.dentalService.deleteFollowup(id);
  }
}
