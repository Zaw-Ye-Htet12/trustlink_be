import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentProfile } from './agent.entity';
import { VerificationDocument } from 'src/verification_docs/verification_docs.entity';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { AgentRepository } from './agent.repository';
import { VerificationDocumentRepository } from 'src/verification_docs/verification_docs.repository';
import { UsersModule } from 'src/users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentProfile, VerificationDocument]),
    UsersModule,
  ],
  controllers: [AgentController],
  providers: [AgentService, AgentRepository, VerificationDocumentRepository],
  exports: [AgentService, AgentRepository],
})
export class AgentModule {}
