# NestJS 后台API开发教程

本教程基于我们已实现的用户认证系统，指导你如何创建新的功能模块和API接口，并进行有效的调试。

## 目录

1. [项目结构概览](#项目结构概览)
2. [基础概念](#基础概念)
3. [创建新模块](#创建新模块)
4. [定义实体](#定义实体)
5. [创建DTO](#创建dto)
6. [实现服务层](#实现服务层)
7. [开发控制器](#开发控制器)
8. [角色授权](#角色授权)
9. [统一响应格式](#统一响应格式)
10. [调试技巧](#调试技巧)
11. [最佳实践](#最佳实践)

## 项目结构概览

当前项目采用模块化结构，主要包含以下模块：

- **用户模块(user)**: 负责用户管理
- **角色模块(role)**: 处理角色和权限
- **认证模块(auth)**: 处理用户登录、注册等认证功能
- **文章模块(article)**: 文章管理
- **横幅模块(banner)**: 横幅广告管理
- **链接模块(link)**: 链接管理

每个模块通常包含以下文件结构：

```
src/modules/模块名/
├── dto/                  # 数据传输对象
├── entities/             # 实体定义
├── 模块名.controller.ts   # 控制器
├── 模块名.service.ts      # 服务
├── 模块名.module.ts       # 模块定义
```

## 基础概念

在开始前，需要了解NestJS的几个核心概念：

- **模块(Module)**: 功能的封装单元
- **控制器(Controller)**: 处理HTTP请求
- **服务(Service)**: 实现业务逻辑
- **实体(Entity)**: 数据库表结构
- **DTO(Data Transfer Object)**: 数据传输对象，定义请求和响应的数据结构
- **中间件(Middleware)**: 请求处理管道中的功能单元
- **守卫(Guard)**: 处理授权和认证

## 创建新模块

假设我们要创建一个"评论"功能。首先创建模块结构：

```bash
# 创建目录结构
mkdir -p src/modules/comment/dto src/modules/comment/entities
```

### 创建模块文件

创建 `src/modules/comment/comment.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
```

然后在 `src/app.module.ts` 中导入此模块：

```typescript
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [
    // 其他模块...
    CommentModule,
  ],
  // ...
})
export class AppModule {}
```

## 定义实体

创建 `src/modules/comment/entities/comment.entity.ts`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Article } from '../../article/entities/article.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  articleId: number;

  @ManyToOne(() => Article)
  @JoinColumn({ name: 'articleId' })
  article: Article;

  @Column({ default: 1 })
  status: number; // 1-正常，0-禁用

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
```

## 创建DTO

为评论创建DTO，用于验证和传输数据。

创建 `src/modules/comment/dto/create-comment.dto.ts`:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: '评论内容' })
  @IsNotEmpty({ message: '评论内容不能为空' })
  @IsString({ message: '评论内容必须是字符串' })
  content: string;

  @ApiProperty({ description: '文章ID' })
  @IsNumber({}, { message: '文章ID必须是数字' })
  articleId: number;
}
```

创建 `src/modules/comment/dto/update-comment.dto.ts`:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ description: '评论内容', required: false })
  @IsOptional()
  @IsString({ message: '评论内容必须是字符串' })
  content?: string;
}
```

## 实现服务层

创建 `src/modules/comment/comment.service.ts`:

```typescript
import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: number): Promise<Comment> {
    this.logger.log(`用户 ${userId} 创建评论: ${JSON.stringify(createCommentDto)}`);
    try {
      const comment = this.commentRepository.create({
        ...createCommentDto,
        userId,
      });
      return await this.commentRepository.save(comment);
    } catch (error) {
      this.logger.error(`创建评论失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Comment[]> {
    try {
      return await this.commentRepository.find({
        relations: ['user', 'article'],
      });
    } catch (error) {
      this.logger.error(`获取所有评论失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<Comment> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id },
        relations: ['user', 'article'],
      });
      
      if (!comment) {
        this.logger.warn(`评论ID ${id} 不存在`);
        throw new NotFoundException(`评论ID ${id} 不存在`);
      }
      
      return comment;
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(`获取评论 ${id} 失败: ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  async findByArticleId(articleId: number): Promise<Comment[]> {
    try {
      this.logger.log(`获取文章 ${articleId} 的评论`);
      return await this.commentRepository.find({
        where: { articleId, status: 1 },
        relations: ['user'],
        order: { createTime: 'DESC' }
      });
    } catch (error) {
      this.logger.error(`获取文章 ${articleId} 评论失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, userId: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    try {
      const comment = await this.findOne(id);
      
      // 检查是否是评论作者或管理员
      if (comment.userId !== userId) {
        // 检查是否有管理员权限在RolesGuard中处理
        // 这里只检查是否是评论作者
        this.logger.warn(`用户 ${userId} 尝试修改非本人评论 ${id}`);
        throw new ForbiddenException('您没有权限修改该评论');
      }
      
      this.logger.log(`用户 ${userId} 更新评论 ${id}: ${JSON.stringify(updateCommentDto)}`);
      
      Object.assign(comment, updateCommentDto);
      
      return await this.commentRepository.save(comment);
    } catch (error) {
      if (!(error instanceof NotFoundException) && !(error instanceof ForbiddenException)) {
        this.logger.error(`更新评论 ${id} 失败: ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const comment = await this.findOne(id);
      this.logger.log(`删除评论 ${id}`);
      await this.commentRepository.remove(comment);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(`删除评论 ${id} 失败: ${error.message}`, error.stack);
      }
      throw error;
    }
  }
}
```

## 开发控制器

创建 `src/modules/comment/comment.controller.ts`:

```typescript
import { 
  Controller, Get, Post, Body, Param, Put, 
  Delete, UseGuards, Req, Query, ParseIntPipe,
  HttpStatus, InternalServerErrorException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiResponseDto } from '../../common/dto/api-response.dto';

@ApiTags('评论')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建评论' })
  @ApiResponse({ status: 201, description: '评论创建成功' })
  async create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    try {
      const comment = await this.commentService.create(createCommentDto, req.user.id);
      return ApiResponseDto.success(comment, '评论创建成功');
    } catch (error) {
      // 这里不需要处理具体异常，会被全局异常过滤器捕获
      // 但我们可以添加一些额外的错误信息
      throw new InternalServerErrorException(`创建评论失败: ${error.message}`);
    }
  }

  @Get()
  @ApiOperation({ summary: '获取评论列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAll() {
    try {
      const comments = await this.commentService.findAll();
      return ApiResponseDto.success(comments, '获取评论列表成功');
    } catch (error) {
      throw new InternalServerErrorException(`获取评论列表失败: ${error.message}`);
    }
  }

  @Get('article/:articleId')
  @ApiOperation({ summary: '获取指定文章的评论' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findByArticleId(@Param('articleId', ParseIntPipe) articleId: number) {
    try {
      const comments = await this.commentService.findByArticleId(articleId);
      return ApiResponseDto.success(
        comments, 
        comments.length > 0 
          ? `获取文章ID ${articleId} 的评论成功，共 ${comments.length} 条`
          : `文章ID ${articleId} 暂无评论`
      );
    } catch (error) {
      throw new InternalServerErrorException(`获取文章评论失败: ${error.message}`);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: '获取指定评论' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const comment = await this.commentService.findOne(id);
      return ApiResponseDto.success(comment, `获取评论ID ${id} 成功`);
    } catch (error) {
      // 不需要在这里处理NotFoundException，会被全局异常过滤器捕获
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新评论' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req
  ) {
    try {
      // 传入用户ID以便校验权限
      const comment = await this.commentService.update(id, req.user.id, updateCommentDto);
      return ApiResponseDto.success(comment, `评论ID ${id} 更新成功`);
    } catch (error) {
      // 传递原始错误，由全局异常过滤器处理
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除评论' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.commentService.remove(id);
      return ApiResponseDto.success(null, `评论ID ${id} 删除成功`);
    } catch (error) {
      throw error;
    }
  }
}
```

## 角色授权

我们的控制器中使用了 `@Roles('admin')` 装饰器来限制某些接口只能由管理员访问。这需要先配置RolesGuard：

```typescript
// 位于 src/modules/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    return this.matchRoles(roles, user.roles.map(role => role.name));
  }

  private matchRoles(requiredRoles: string[], userRoles: string[]): boolean {
    return userRoles.some(role => requiredRoles.includes(role));
  }
}
```

## 统一响应格式

为了确保API接口返回统一的数据格式，我们需要创建统一的响应结构，并使用拦截器来处理响应和异常。

### 1. 创建统一响应DTO

首先，创建一个统一的响应数据传输对象(DTO):

```typescript
// src/common/dto/api-response.dto.ts
export class ApiResponseDto<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;

  constructor(code: number, message: string, data: T = null) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.timestamp = Date.now();
  }

  static success<T>(data: T = null, message: string = 'success'): ApiResponseDto<T> {
    return new ApiResponseDto<T>(200, message, data);
  }

  static error(message: string = 'error', code: number = 500): ApiResponseDto<null> {
    return new ApiResponseDto<null>(code, message, null);
  }
}
```

### 2. 创建响应拦截器

接下来，创建响应拦截器来自动格式化所有返回:

```typescript
// src/common/interceptors/transform.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseDto<T>> {
    return next.handle().pipe(
      map(data => {
        // 已经是ApiResponseDto格式的，直接返回
        if (data instanceof ApiResponseDto) {
          return data;
        }
        // 不是ApiResponseDto格式的，转换为统一格式
        return ApiResponseDto.success(data);
      }),
    );
  }
}
```

### 3. 全局异常过滤器

然后，创建一个全局异常过滤器来统一处理错误:

```typescript
// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseDto } from '../dto/api-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    // 提取请求和响应
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // 决定HTTP状态码和错误消息
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse['message'] || 'Internal server error';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // 记录错误
    this.logger.error(
      `异常 - 路径: ${request.url} - 状态: ${status} - 消息: ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    // 返回统一格式的错误响应
    const errorResponse = ApiResponseDto.error(message, status);
    response.status(status).json(errorResponse);
  }
}
```

### 4. 在main.ts中全局注册

最后，在应用的入口文件中注册这些全局组件:

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe());
  
  // 全局注册响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  
  // 全局注册异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // 其他配置...
  
  await app.listen(3000);
}
bootstrap();
```

### 5. 统一响应格式示例

使用上述配置后，所有API响应将自动转换为统一格式:

#### 成功响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "content": "这是一条评论",
    "userId": 1,
    "articleId": 1,
    "status": 1,
    "createTime": "2023-05-10T13:45:30.123Z",
    "updateTime": "2023-05-10T13:45:30.123Z",
    "user": {
      "id": 1,
      "username": "testuser"
    }
  },
  "timestamp": 1683730730123
}
```

#### 错误响应示例

当发生验证错误时:

```json
{
  "code": 400,
  "message": "评论内容不能为空",
  "data": null,
  "timestamp": 1683730830456
}
```

当尝试访问不存在的资源时:

```json
{
  "code": 404,
  "message": "评论ID 999 不存在",
  "data": null,
  "timestamp": 1683730930789
}
```

当无权限操作时:

```json
{
  "code": 403,
  "message": "Forbidden resource",
  "data": null,
  "timestamp": 1683731031012
}
```

### 6. 在控制器中处理异常

通过全局异常过滤器，我们可以统一处理异常。但在服务层应该抛出明确的异常以提供详细的错误信息:

```typescript
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';

@Injectable()
export class CommentService {
  // ... 其他代码 ...

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'article'],
    });
    
    if (!comment) {
      throw new NotFoundException(`评论ID ${id} 不存在`);
    }
    
    return comment;
  }

  async update(id: number, userId: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findOne(id);
    
    // 检查是否是评论作者或管理员
    if (comment.userId !== userId) {
      throw new BadRequestException('只能修改自己的评论');
    }
    
    Object.assign(comment, updateCommentDto);
    
    return this.commentRepository.save(comment);
  }
}
```

### 7. 常用的NestJS异常类型

NestJS提供了多种内置的HTTP异常类:

- `BadRequestException` - 400 错误请求
- `UnauthorizedException` - 401 未授权
- `ForbiddenException` - 403 禁止访问
- `NotFoundException` - 404 未找到资源
- `ConflictException` - 409 资源冲突
- `GoneException` - 410 资源不再可用
- `PayloadTooLargeException` - 413 请求体过大
- `UnsupportedMediaTypeException` - 415 不支持的媒体类型
- `UnprocessableEntityException` - 422 无法处理的实体
- `InternalServerErrorException` - 500 内部服务器错误
- `NotImplementedException` - 501 未实现
- `BadGatewayException` - 502 网关错误
- `ServiceUnavailableException` - 503 服务不可用
- `GatewayTimeoutException` - 504 网关超时

## 调试技巧

### 1. 使用日志记录

NestJS 内置了Logger类，可用于记录关键信息：

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  async create(createCommentDto: CreateCommentDto, userId: number): Promise<Comment> {
    this.logger.log(`用户 ${userId} 创建评论: ${JSON.stringify(createCommentDto)}`);
    try {
      // 原有代码...
    } catch (error) {
      this.logger.error(`创建评论失败: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

### 2. 全局异常过滤器

我们已经实现了一个全局异常过滤器，它会记录错误并格式化返回：

```typescript
// 位于 src/common/filters/http-exception.filter.ts
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    // 提取请求和响应
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // 决定HTTP状态码和错误消息
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse['message'] || 'Internal server error';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // 记录错误
    this.logger.error(
      `异常 - 路径: ${request.url} - 状态: ${status} - 消息: ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    // 返回统一格式的错误响应
    const errorResponse = ApiResponseDto.error(message, status);
    response.status(status).json(errorResponse);
  }
}
```

### 3. 使用PowerShell测试API

可以使用PowerShell来测试接口：

```powershell
# 登录以获取token
$loginBody = @{ 
    username = "testuser11"
    password = "123456" 
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody

# 保存token
$token = $response.data.access_token

# 创建评论
$commentBody = @{
    content = "这是一条测试评论"
    articleId = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/comments" -Method POST -ContentType "application/json" -Body $commentBody -Headers @{
    Authorization = "Bearer $token"
}

# 获取文章的评论
Invoke-RestMethod -Uri "http://localhost:3000/api/comments/article/1" -Method GET
```

### 4. 数据库查询调试

直接使用MySQL命令行工具查询数据：

```powershell
mysql -h localhost -u root -proot -e "SELECT * FROM my_nest_admin.comments WHERE articleId = 1;"
```

### 5. 使用Swagger文档测试API

访问 http://localhost:3000/api/docs 可以通过Swagger UI界面测试所有API。

## 最佳实践

### 1. 代码结构一致性

保持各模块结构一致，遵循命名规范：
- 单数形式命名模块文件夹（如`user`而非`users`）
- 控制器和服务类名使用大驼峰命名法
- 文件名使用烤肉串命名法（kebab-case）

### 2. 错误处理

- 在服务层抛出具体的异常，如`NotFoundException`、`BadRequestException`等
- 使用全局异常过滤器统一处理错误
- 记录关键错误信息以便排查

### 3. 数据验证

- 使用DTO和class-validator进行数据验证
- 在DTO中添加详细的错误消息
- 使用Swagger装饰器添加API文档说明

### 4. 安全性

- 敏感接口使用JwtAuthGuard保护
- 管理员接口额外使用RolesGuard检查角色
- 密码等敏感数据永远使用bcrypt等安全工具加密存储

### 5. 性能优化

- 适当使用关系加载（Relations）
- 合理设置数据库索引
- 对于大数据集使用分页查询

通过遵循以上原则，你可以快速开发出功能完善、结构清晰的API接口，并能有效进行调试排错。 