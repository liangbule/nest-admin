import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './entities/article.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('文章管理')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // 前台接口
  @Get()
  @ApiOperation({ summary: '获取所有已发布的文章（前台）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取指定文章（前台）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findOne(@Param('id') id: string): Promise<Article> {
    return this.articleService.findOne(+id);
  }

  @Get('author/:authorId')
  @ApiOperation({ summary: '获取指定作者的文章（前台）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findByAuthor(@Param('authorId') authorId: string): Promise<Article[]> {
    return this.articleService.findByAuthor(+authorId);
  }

  // 后台接口
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建文章（后台）' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Req() req: RequestWithUser,
  ): Promise<Article> {
    return this.articleService.create(createArticleDto, req.user);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取所有文章（后台）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAllAdmin(): Promise<Article[]> {
    return this.articleService.findAllAdmin();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取指定文章（后台）' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findOneAdmin(@Param('id') id: string): Promise<Article> {
    return this.articleService.findOne(+id);
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新文章（后台）' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: Partial<CreateArticleDto>,
  ): Promise<Article> {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除文章（后台）' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.articleService.remove(+id);
  }
}
