import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinkCategory } from './entities/link-category.entity';
import { CreateLinkCategoryDto } from './dto/create-link-category.dto';

@Injectable()
export class LinkCategoryService {
  constructor(
    @InjectRepository(LinkCategory)
    private readonly categoryRepository: Repository<LinkCategory>,
  ) {}

  async create(
    createLinkCategoryDto: CreateLinkCategoryDto,
  ): Promise<LinkCategory> {
    const category = this.categoryRepository.create(createLinkCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<LinkCategory[]> {
    return this.categoryRepository.find({
      order: {
        weight: 'DESC',
        createTime: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<LinkCategory> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateLinkCategoryDto: Partial<CreateLinkCategoryDto>,
  ): Promise<LinkCategory> {
    await this.categoryRepository.update(id, updateLinkCategoryDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.categoryRepository.softDelete(id);
  }

  async restore(id: number): Promise<LinkCategory> {
    await this.categoryRepository.restore(id);
    return this.findOne(id);
  }
}
