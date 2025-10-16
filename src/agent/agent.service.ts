import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentProfile } from './agent.entity';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(AgentProfile)
    private readonly agentRepo: Repository<AgentProfile>,
  ) {}

  async findAll() {
    return this.agentRepo.find({ relations: ['user'] });
  }

  async findById(id: number) {
    const agent = await this.agentRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!agent) throw new NotFoundException('Agent not found');
    return agent;
  }

  async update(id: number, dto: UpdateAgentDto) {
    const agent = await this.findById(id);
    Object.assign(agent, dto);
    return this.agentRepo.save(agent);
  }

  async remove(id: number) {
    const agent = await this.findById(id);
    await this.agentRepo.remove(agent);
  }
}
