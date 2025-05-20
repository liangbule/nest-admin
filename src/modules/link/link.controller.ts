import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LinkService } from './link.service';
import { Link } from './entities/link.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';

@ApiTags('友链管理')
@Controller('links')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建友链' })
  @ApiResponse({ status: 201, description: '创建成功', type: Link })
  create(@Body() createLinkDto: CreateLinkDto): Promise<Link> {
    return this.linkService.create(createLinkDto);
  }

  @Get()
  @ApiOperation({ summary: '获取友链列表（前台）' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: PaginationResponseDto,
  })
  findAll(
    @Query() paginationDto: PaginationDto = new PaginationDto(),
  ): Promise<PaginationResponseDto<Link>> {
    // 确保参数始终为数字
    if (!paginationDto.page) paginationDto.page = 1;
    if (!paginationDto.limit) paginationDto.limit = 10;
    return this.linkService.findAll(paginationDto);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取友链列表（后台）' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: PaginationResponseDto,
  })
  findAllAdmin(
    @Query() paginationDto: PaginationDto = new PaginationDto(),
  ): Promise<PaginationResponseDto<Link>> {
    // 确保参数始终为数字
    if (!paginationDto.page) paginationDto.page = 1;
    if (!paginationDto.limit) paginationDto.limit = 10;
    return this.linkService.findAllAdmin(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取友链详情' })
  @ApiResponse({ status: 200, description: '获取成功', type: Link })
  findOne(@Param('id') id: string): Promise<Link> {
    return this.linkService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新友链' })
  @ApiResponse({ status: 200, description: '更新成功', type: Link })
  update(
    @Param('id') id: string,
    @Body() updateLinkDto: Partial<CreateLinkDto>,
  ): Promise<Link> {
    return this.linkService.update(+id, updateLinkDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除友链' })
  @ApiResponse({ status: 200, description: '删除成功' })
  remove(@Param('id') id: string): Promise<void> {
    return this.linkService.remove(+id);
  }

  @Post(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '恢复友链' })
  @ApiResponse({ status: 200, description: '恢复成功', type: Link })
  restore(@Param('id') id: string): Promise<Link> {
    return this.linkService.restore(+id);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: '获取分类下的友链列表' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: PaginationResponseDto,
  })
  findByCategory(
    @Param('categoryId') categoryId: string,
    @Query() paginationDto: PaginationDto = new PaginationDto(),
  ): Promise<PaginationResponseDto<Link>> {
    // 确保参数始终为数字
    if (!paginationDto.page) paginationDto.page = 1;
    if (!paginationDto.limit) paginationDto.limit = 10;
    return this.linkService.findByCategory(+categoryId, paginationDto);
  }
}
