import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from 'src/users/user.entity';
import { AgentProfile } from 'src/agent/agent.entity';
import { VerificationDocument } from 'src/shared/verification_docs/verification_docs.entity';
import { Category } from 'src/shared/category/category.entity';
import { Tag } from 'src/shared/tag/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      AgentProfile,
      VerificationDocument,
      Category,
      Tag,
    ]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
