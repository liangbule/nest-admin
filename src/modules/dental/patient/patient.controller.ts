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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PatientService } from './patient.service';
import {
  CreatePatientDto,
  UpdatePatientDto,
  PatientQueryDto,
} from './dto/patient.dto';

@ApiTags('患者管理')
@Controller('dental/patients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiOperation({
    summary: '获取患者列表',
    description: '获取患者列表，支持分页、筛选',
  })
  @ApiResponse({ status: 200, description: '成功返回患者列表' })
  @Get()
  async getPatients(@Query() query: PatientQueryDto) {
    return this.patientService.getPatients(query);
  }

  @ApiOperation({ summary: '获取患者详情', description: '根据ID获取患者详情' })
  @ApiResponse({ status: 200, description: '成功返回患者信息' })
  @ApiResponse({ status: 404, description: '患者不存在' })
  @Get(':id')
  async getPatient(@Param('id') id: string) {
    return this.patientService.getPatient(id);
  }

  @ApiOperation({ summary: '创建新患者', description: '创建新患者记录' })
  @ApiResponse({ status: 201, description: '成功创建患者' })
  @Post()
  async createPatient(@Body() patientData: CreatePatientDto) {
    return this.patientService.createPatient(patientData);
  }

  @ApiOperation({ summary: '更新患者信息', description: '根据ID更新患者信息' })
  @ApiResponse({ status: 200, description: '成功更新患者信息' })
  @ApiResponse({ status: 404, description: '患者不存在' })
  @Put(':id')
  async updatePatient(
    @Param('id') id: string,
    @Body() patientData: UpdatePatientDto,
  ) {
    return this.patientService.updatePatient(id, patientData);
  }

  @ApiOperation({ summary: '删除患者', description: '根据ID删除患者' })
  @ApiResponse({ status: 200, description: '成功删除患者' })
  @ApiResponse({ status: 404, description: '患者不存在' })
  @Delete(':id')
  async deletePatient(@Param('id') id: string) {
    return this.patientService.deletePatient(id);
  }
}
