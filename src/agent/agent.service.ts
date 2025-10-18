import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { AgentRepository } from './agent.repository';
import { VerificationDocumentRepository } from 'src/verification_docs/verification_docs.repository';
import { AgentProfileResponse } from './dto/response/agent-profile.dto';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { SubmitVerificationDocumentDto } from './dto/submit-documents.dto';
import { UserRepository } from 'src/users/user.repository';

@Injectable()
export class AgentService {
  constructor(
    private readonly agentRepository: AgentRepository,
    private readonly verificationDocRepository: VerificationDocumentRepository,
    private readonly userRepository: UserRepository,
  ) {}

  // Get agent profile by user ID
  async getProfile(userId: number): Promise<AgentProfileResponse> {
    const agent = await this.agentRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!agent) throw new NotFoundException('Agent profile not found');
    return agent;
  }

  // Get agent profile by agent ID (public)
  async getAgentById(id: number): Promise<AgentProfileResponse> {
    const agent = await this.agentRepository.findOne({
      where: { id },
      relations: ['user', 'services', 'reviews'],
    });

    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }

    // Only return approved agents for public view
    if (agent.verification_status !== VerificationStatus.APPROVED) {
      throw new ForbiddenException('Agent profile is not available');
    }

    return agent;
  }

  // Update agent profile
  async updateProfile(
    userId: number,
    dto: UpdateAgentDto,
  ): Promise<AgentProfileResponse> {
    const agent = await this.agentRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!agent) throw new NotFoundException('Agent profile not found');

    Object.assign(agent, dto);
    return await this.agentRepository.save(agent);
  }

  // Submit verification document
  async submitVerification(userId: number, dto: SubmitVerificationDocumentDto) {
    const agent = await this.agentRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!agent) throw new NotFoundException('Agent profile not found');

    const document = this.verificationDocRepository.create({
      agent_id: agent.id,
      document_type: dto.document_type,
      document_url: dto.document_url,
      admin_notes: dto.admin_notes,
      status: VerificationStatus.PENDING,
    });

    return this.verificationDocRepository.save(document);
  }

  async getVerificationStatus(userId: number) {
    const agent = await this.agentRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!agent) throw new NotFoundException('Agent profile not found');

    const documents = await this.verificationDocRepository.find({
      where: { agent_id: agent.id },
      order: { created_at: 'DESC' },
    });

    return {
      agent_id: agent.id,
      verification_status: agent.verification_status,
      documents,
    };
  }
}
