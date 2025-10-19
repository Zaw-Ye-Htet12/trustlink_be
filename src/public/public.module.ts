import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentProfile } from 'src/agent/agent.entity';
import { Service } from 'src/agent/service/service.entity';
import { Review } from 'src/shared/review/review.entity';
import { Category } from 'src/shared/category/category.entity';
import { Tag } from 'src/shared/tag/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentProfile, Service, Review, Category, Tag]),
  ],
  controllers: [PublicController],
  providers: [PublicService],
})
export class PublicModule {}
