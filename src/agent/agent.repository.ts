import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AgentProfile } from './agent.entity';

@Injectable()
export class AgentRepository extends Repository<AgentProfile> {
  constructor(private readonly dataSource: DataSource) {
    super(AgentProfile, dataSource.createEntityManager());
  }
}
