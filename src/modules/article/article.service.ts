import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    author: User,
  ): Promise<Article> {
    const article = this.articleRepository.create({
      ...createArticleDto,
      author,
    });
    return await this.articleRepository.save(article);
  }

  async findAll(): Promise<Article[]> {
    return await this.articleRepository.find({
      relations: ['author'],
      where: {
        status: 1, // 只返回已发布的文章
      },
      order: {
        createTime: 'DESC',
      },
    });
  }

  async findAllAdmin(): Promise<Article[]> {
    return await this.articleRepository.find({
      relations: ['author'],
      order: {
        createTime: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!article) {
      throw new NotFoundException(`文章ID ${id} 不存在`);
    }
    // 增加浏览量
    article.views += 1;
    await this.articleRepository.save(article);
    return article;
  }

  async update(
    id: number,
    updateArticleDto: Partial<CreateArticleDto>,
  ): Promise<Article> {
    const article = await this.findOne(id);
    Object.assign(article, updateArticleDto);
    return await this.articleRepository.save(article);
  }

  async remove(id: number): Promise<void> {
    const article = await this.findOne(id);
    await this.articleRepository.remove(article);
  }

  async findByAuthor(authorId: number): Promise<Article[]> {
    return await this.articleRepository.find({
      where: {
        author: { id: authorId },
        status: 1, // 只返回已发布的文章
      },
      relations: ['author'],
      order: {
        createTime: 'DESC',
      },
    });
  }
}
