import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { Link } from './entities/link.entity';
import { LinkCategory } from './entities/link-category.entity';
import { LinkCategoryService } from './link-category.service';
import { LinkCategoryController } from './link-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Link, LinkCategory])],
  controllers: [LinkController, LinkCategoryController],
  providers: [LinkService, LinkCategoryService],
  exports: [LinkService, LinkCategoryService],
})
export class LinkModule {}
