import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './entities/link.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import { LinkCategory } from './entities/link-category.entity';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
    @InjectRepository(LinkCategory)
    private readonly categoryRepository: Repository<LinkCategory>,
  ) {}

  async create(createLinkDto: CreateLinkDto): Promise<Link> {
    const link = this.linkRepository.create(createLinkDto);
    if (createLinkDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: createLinkDto.categoryId },
      });
      if (category) {
        link.category = category;
      }
    }
    return this.linkRepository.save(link);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<Link>> {
    const [items, total] = await this.linkRepository.findAndCount({
      where: { deleteTime: null, status: 1 },
      relations: ['category'],
      order: {
        weight: 'DESC',
        createTime: 'DESC',
      },
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
    });

    return new PaginationResponseDto(
      items,
      total,
      paginationDto.page,
      paginationDto.limit,
    );
  }

  async findAllAdmin(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<Link>> {
    const [items, total] = await this.linkRepository.findAndCount({
      where: { deleteTime: null },
      relations: ['category'],
      order: {
        weight: 'DESC',
        createTime: 'DESC',
      },
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
    });

    return new PaginationResponseDto(
      items,
      total,
      paginationDto.page,
      paginationDto.limit,
    );
  }

  async findOne(id: number): Promise<Link> {
    const link = await this.linkRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (link) {
      link.views++;
      await this.linkRepository.save(link);
    }
    return link;
  }

  async update(
    id: number,
    updateLinkDto: Partial<CreateLinkDto>,
  ): Promise<Link> {
    const link = await this.findOne(id);
    if (!link) {
      return null;
    }

    if (updateLinkDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateLinkDto.categoryId },
      });
      if (category) {
        link.category = category;
      }
    }

    Object.assign(link, updateLinkDto);
    return this.linkRepository.save(link);
  }

  async remove(id: number): Promise<void> {
    await this.linkRepository.softDelete(id);
  }

  async restore(id: number): Promise<Link> {
    await this.linkRepository.restore(id);
    return this.findOne(id);
  }

  async findByCategory(
    categoryId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<Link>> {
    const [items, total] = await this.linkRepository.findAndCount({
      where: {
        categoryId,
        deleteTime: null,
        status: 1,
      },
      relations: ['category'],
      order: {
        weight: 'DESC',
        createTime: 'DESC',
      },
      skip: (paginationDto.page - 1) * paginationDto.limit,
      take: paginationDto.limit,
    });

    return new PaginationResponseDto(
      items,
      total,
      paginationDto.page,
      paginationDto.limit,
    );
  }
}
