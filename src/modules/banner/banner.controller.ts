import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BannerService } from './banner.service';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('轮播图管理')
@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  // 前台接口
  @Get()
  @ApiOperation({ summary: '获取所有启用的轮播图（前台）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAll(): Promise<Banner[]> {
    return this.bannerService.findAll();
  }

  // 后台接口
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建轮播图（后台）' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Body() createBannerDto: CreateBannerDto): Promise<Banner> {
    return this.bannerService.create(createBannerDto);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取所有轮播图（后台）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAllAdmin(): Promise<Banner[]> {
    return this.bannerService.findAllAdmin();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取指定轮播图（后台）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findOne(@Param('id') id: string): Promise<Banner> {
    return this.bannerService.findOne(+id);
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新轮播图（后台）' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(
    @Param('id') id: string,
    @Body() updateBannerDto: Partial<CreateBannerDto>,
  ): Promise<Banner> {
    return this.bannerService.update(+id, updateBannerDto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除轮播图（后台）' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.bannerService.remove(+id);
  }
}
