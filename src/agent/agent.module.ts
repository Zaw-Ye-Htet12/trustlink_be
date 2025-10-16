import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentProfile } from './agent.entity';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { AgentRepository } from './agent.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AgentProfile])],
  controllers: [AgentController],
  providers: [AgentService, AgentRepository],
  exports: [AgentService],
})
export class AgentModule {}
