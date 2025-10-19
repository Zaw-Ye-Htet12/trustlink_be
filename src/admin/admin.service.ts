import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { AgentProfile } from 'src/agent/agent.entity';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { VerifyAgentDto } from './dto/verify-agent.dto';
import { VerificationDocument } from 'src/shared/verification_docs/verification_docs.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';
import { Category } from 'src/shared/category/category.entity';
import { Tag } from 'src/shared/tag/tag.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(AgentProfile)
    private readonly agentRepo: Repository<AgentProfile>,

    @InjectRepository(VerificationDocument)
    private readonly verificationRepo: Repository<VerificationDocument>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
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
      relations: ['user', 'verificationDocuments'],
    });
    if (!agent) throw new NotFoundException('Agent not found');

    return { agent };
  }

  /** Approve agent */
  async approveAgent(agentId: number, dto: VerifyAgentDto) {
    const agent = await this.agentRepo.findOne({
      where: { id: agentId },
      relations: ['verificationDocuments'],
    });
    if (!agent) throw new NotFoundException('Agent not found');

    // Update each document status
    for (const doc of agent.verificationDocuments) {
      doc.status = VerificationStatus.APPROVED;
      doc.admin_notes = dto.admin_notes || '';
      await this.verificationRepo.save(doc);
    }

    // Update agent profile
    agent.verification_status = VerificationStatus.APPROVED;
    return this.agentRepo.save(agent);
  }

  /** Reject agent */
  async rejectAgent(agentId: number, dto: VerifyAgentDto) {
    const agent = await this.agentRepo.findOne({
      where: { id: agentId },
      relations: ['verificationDocuments'],
    });
    if (!agent) throw new NotFoundException('Agent not found');

    // Update each document status
    for (const doc of agent.verificationDocuments) {
      doc.status = VerificationStatus.REJECTED;
      doc.admin_notes = dto.admin_notes || '';
      await this.verificationRepo.save(doc);
    }

    // Update agent profile
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

  async getAllCategories() {
    return this.categoryRepo.find({ order: { name: 'ASC' } });
  }

  async createCategory(dto: CreateCategoryDto) {
    const exists = await this.categoryRepo.findOne({
      where: { name: dto.name },
    });
    if (exists) throw new ConflictException('Category name already exists');
    const category = this.categoryRepo.create(dto);
    return this.categoryRepo.save(category);
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  async deleteCategory(id: number) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    await this.categoryRepo.remove(category);
    return { message: 'Category deleted successfully' };
  }

  async getAllTags() {
    return this.tagRepo.find({ order: { name: 'ASC' } });
  }

  async createTag(dto: CreateTagDto) {
    const exists = await this.tagRepo.findOne({ where: { name: dto.name } });
    if (exists) throw new ConflictException('Tag already exists');
    const tag = this.tagRepo.create(dto);
    return this.tagRepo.save(tag);
  }

  async deleteTag(id: number) {
    const tag = await this.tagRepo.findOne({ where: { id } });
    if (!tag) throw new NotFoundException('Tag not found');
    await this.tagRepo.remove(tag);
    return { message: 'Tag deleted successfully' };
  }
}
