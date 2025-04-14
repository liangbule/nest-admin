import { ApiProperty } from '@nestjs/swagger';

/**
 * 分页响应DTO
 * 定义分页查询返回的数据结构
 * 包含数据列表、总数、页码等分页信息
 * 用于标准化API的分页返回结果
 */
export class PaginationResponseDto<T> {
  @ApiProperty({ description: '数据列表' })
  items: T[];

  @ApiProperty({ description: '总数量' })
  total: number;

  @ApiProperty({ description: '当前页码' })
  page: number;

  @ApiProperty({ description: '每页数量' })
  limit: number;

  @ApiProperty({ description: '总页数' })
  totalPages: number;

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}
