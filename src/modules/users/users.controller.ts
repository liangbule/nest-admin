import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { User } from './entities/user.entity';

class CreateUserDto {
  username: string;
  password: string;
  email: string;
  roleIds?: number[];
}

class AssignRolesDto {
  roleIds: number[];
}

@ApiTags('用户')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: '用户创建成功',
    type: User,
  })
  @ApiResponse({ status: 409, description: '用户名或邮箱已存在' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: '获取用户信息' })
  @ApiResponse({
    status: 200,
    description: '获取用户信息成功',
    type: User,
  })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/roles')
  @ApiOperation({ summary: '分配用户角色' })
  @ApiBody({ type: AssignRolesDto })
  @ApiResponse({
    status: 200,
    description: '角色分配成功',
    type: User,
  })
  @ApiResponse({ status: 404, description: '用户或角色不存在' })
  async assignRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body('roleIds') roleIds: number[],
  ) {
    return this.usersService.assignRoles(id, roleIds);
  }
}
