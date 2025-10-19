import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentProfile } from './agent.entity';
import { VerificationDocument } from 'src/shared/verification_docs/verification_docs.entity';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { AgentRepository } from './agent.repository';
import { VerificationDocumentRepository } from 'src/shared/verification_docs/verification_docs.repository';
import { UsersModule } from 'src/users/user.module';
import { Review } from 'src/shared/review/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AgentProfile, VerificationDocument, Review]),
    UsersModule,
  ],
  controllers: [AgentController],
  providers: [AgentService, AgentRepository, VerificationDocumentRepository],
  exports: [AgentService, AgentRepository],
})
export class AgentModule {}
