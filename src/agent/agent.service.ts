import { Injectable, NotFoundException } from '@nestjs/common';
import { AgentRepository } from './agent.repository';
import { VerificationDocumentRepository } from 'src/shared/verification_docs/verification_docs.repository';
import { AgentProfileResponse } from './dto/response/agent-profile.dto';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { SubmitVerificationDocumentDto } from './dto/submit-documents.dto';
import { Review } from 'src/shared/review/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AgentService {
  constructor(
    private readonly agentRepository: AgentRepository,
    private readonly verificationDocRepository: VerificationDocumentRepository,
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
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
    return agent;
  }

  // Update agent profile
  // agent.service.ts
  async updateProfile(
    userId: number,
    dto: UpdateAgentDto,
  ): Promise<AgentProfileResponse | null> {
    const agent = await this.agentRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!agent) throw new NotFoundException('Agent profile not found');

    // 🔹 Update AgentProfile fields
    agent.bio = dto.bio ?? agent.bio;
    agent.years_of_experience =
      dto.years_of_experience ?? agent.years_of_experience;
    agent.location = dto.location ?? agent.location;
    agent.service_area = dto.service_area ?? agent.service_area;

    // 🔹 Update User table fields
    if (dto.email) agent.user.email = dto.email;
    if (dto.username) agent.user.username = dto.username;
    if (dto.phone_no) agent.user.phone_no = dto.phone_no;
    if (dto.profile_photo_url)
      agent.user.profile_photo_url = dto.profile_photo_url;

    // 🔹 Save both
    await this.agentRepository.save(agent);

    // Refresh relations for response
    const updated = await this.agentRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    return updated;
  }

  // Submit verification document
  async submitVerification(userId: number, dto: SubmitVerificationDocumentDto) {
    const agent = await this.agentRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!agent) throw new NotFoundException('Agent profile not found');

    const document = this.verificationDocRepository.create({
      agent,
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
      where: { agent: { id: agent.id } },
      order: { created_at: 'DESC' },
    });

    return {
      agent_id: agent.id,
      verification_status: agent.verification_status,
      documents,
    };
  }

  /** ✅ View all reviews received by this agent */
  async getMyReviews(userId: number): Promise<Review[]> {
    const agent = await this.agentRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!agent) throw new NotFoundException('Agent profile not found');

    const reviews = await this.reviewRepo.find({
      where: { agent: { id: agent.id } },
      relations: ['customer', 'customer.user', 'service'],
      order: { created_at: 'DESC' },
    });

    return reviews;
  }

  /** ✅ Get review statistics (average rating, total reviews) */
  async getReviewSummary(userId: number): Promise<{
    agent_id: number;
    average_rating: number | null;
    total_reviews: number;
  }> {
    const agent = await this.agentRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!agent) throw new NotFoundException('Agent profile not found');

    const rawResult = await this.reviewRepo
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.agent_id = :agentId', { agentId: agent.id })
      .getRawOne<{ avg: string | null; count: string | null }>();

    const avg = rawResult?.avg ?? null;
    const count = rawResult?.count ?? null;

    const average_rating = avg ? parseFloat(avg) : null;
    const total_reviews = count ? parseInt(count, 10) : 0;

    return {
      agent_id: agent.id,
      average_rating,
      total_reviews,
    };
  }
}
