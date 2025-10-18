import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { AgentProfile } from 'src/agent/agent.entity';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { VerifyAgentDto } from './dto/verify-agent.dto';
import { VerificationDocument } from 'src/verification_docs/verification_docs.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(AgentProfile)
    private readonly agentRepo: Repository<AgentProfile>,

    @InjectRepository(VerificationDocument)
    private readonly verificationRepo: Repository<VerificationDocument>,
  ) {}

  /** Dashboard summary */
  async getDashboard() {
    const totalUsers = await this.userRepo.count();
    const totalAgents = await this.userRepo.count({
      where: { role: UserRole.AGENT },
    });
    const totalCustomers = await this.userRepo.count({
      where: { role: UserRole.CUSTOMER },
    });
    const totalPendingVerifications = await this.verificationRepo.count({
      where: { status: VerificationStatus.PENDING },
    });

    return {
      totalUsers,
      totalAgents,
      totalCustomers,
      totalPendingVerifications,
    };
  }

  /** List all agents */
  async getAllAgents() {
    return this.agentRepo.find({ relations: ['user'] });
  }

  /** Get detailed agent info + documents */
  async getAgentById(agentId: number) {
    const agent = await this.agentRepo.findOne({
      where: { id: agentId },
      relations: ['user'],
    });
    if (!agent) throw new NotFoundException('Agent not found');

    const documents = await this.verificationRepo.find({
      where: { agent_id: agentId },
    });

    return { agent, documents };
  }

  /** Approve agent */
  async approveAgent(agentId: number, dto: VerifyAgentDto) {
    const agent = await this.agentRepo.findOne({ where: { id: agentId } });
    if (!agent) throw new NotFoundException('Agent not found');

    const docs = await this.verificationRepo.find({
      where: { agent_id: agentId },
    });
    for (const doc of docs) {
      doc.status = VerificationStatus.APPROVED;
      doc.admin_notes = dto.admin_notes || '';
      await this.verificationRepo.save(doc);
    }

    agent.verification_status = VerificationStatus.APPROVED;
    return this.agentRepo.save(agent);
  }

  /** Reject agent */
  async rejectAgent(agentId: number, dto: VerifyAgentDto) {
    const agent = await this.agentRepo.findOne({ where: { id: agentId } });
    if (!agent) throw new NotFoundException('Agent not found');

    const docs = await this.verificationRepo.find({
      where: { agent_id: agentId },
    });
    for (const doc of docs) {
      doc.status = VerificationStatus.REJECTED;
      doc.admin_notes = dto.admin_notes || '';
      await this.verificationRepo.save(doc);
    }

    agent.verification_status = VerificationStatus.REJECTED;
    return this.agentRepo.save(agent);
  }

  /** Get all users */
  async getAllUsers() {
    return this.userRepo.find();
  }

  /** Update user status (activate/deactivate) */
  async updateUserStatus(userId: number, dto: UpdateUserStatusDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.is_active = dto.is_active;
    return this.userRepo.save(user);
  }

  /** Delete / ban user */
  async deleteUser(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.userRepo.remove(user);
  }

  /** List all verification documents */
  async getAllVerificationDocuments() {
    return this.verificationRepo.find({ relations: ['agent'] });
  }

  /** Get document details */
  async getVerificationDocumentById(docId: number) {
    const doc = await this.verificationRepo.findOne({
      where: { id: docId },
      relations: ['agent'],
    });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }
}
