import { Controller, Get, Param, Put, Delete, Body } from '@nestjs/common';
import { AgentService } from './agent.service';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Controller('agents')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get()
  findAll() {
    return this.agentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.agentService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateAgentDto) {
    return this.agentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.agentService.remove(id);
  }
}
