import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';

// Entities
import { Service } from './service.entity';
import { ServiceImage } from 'src/shared/service_image/service_image.entity';
import { AgentProfile } from 'src/agent/agent.entity';
import { Category } from 'src/shared/category/category.entity';
import { Tag } from 'src/shared/tag/tag.entity';
import { Review } from 'src/shared/review/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Service,
      ServiceImage,
      AgentProfile,
      Category,
      Tag,
      Review,
    ]),
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService], // export if used by other modules (e.g., AgentModule)
})
export class ServiceModule {}
