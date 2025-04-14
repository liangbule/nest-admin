import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LinkCategoryService } from './link-category.service';
import { LinkCategory } from './entities/link-category.entity';
import { CreateLinkCategoryDto } from './dto/create-link-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('友链分类管理')
@Controller('link-categories')
export class LinkCategoryController {
  constructor(private readonly categoryService: LinkCategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建友链分类' })
  @ApiResponse({ status: 201, description: '创建成功', type: LinkCategory })
  create(
    @Body() createLinkCategoryDto: CreateLinkCategoryDto,
  ): Promise<LinkCategory> {
    return this.categoryService.create(createLinkCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: '获取友链分类列表' })
  @ApiResponse({ status: 200, description: '获取成功', type: [LinkCategory] })
  findAll(): Promise<LinkCategory[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取友链分类详情' })
  @ApiResponse({ status: 200, description: '获取成功', type: LinkCategory })
  findOne(@Param('id') id: string): Promise<LinkCategory> {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新友链分类' })
  @ApiResponse({ status: 200, description: '更新成功', type: LinkCategory })
  update(
    @Param('id') id: string,
    @Body() updateLinkCategoryDto: Partial<CreateLinkCategoryDto>,
  ): Promise<LinkCategory> {
    return this.categoryService.update(+id, updateLinkCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除友链分类' })
  @ApiResponse({ status: 200, description: '删除成功' })
  remove(@Param('id') id: string): Promise<void> {
    return this.categoryService.remove(+id);
  }

  @Post(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '恢复友链分类' })
  @ApiResponse({ status: 200, description: '恢复成功', type: LinkCategory })
  restore(@Param('id') id: string): Promise<LinkCategory> {
    return this.categoryService.restore(+id);
  }
}
