import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from 'src/users/user.entity';
import { AgentProfile } from 'src/agent/agent.entity';
import { VerificationDocument } from 'src/verification_docs/verification_docs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AgentProfile, VerificationDocument]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
