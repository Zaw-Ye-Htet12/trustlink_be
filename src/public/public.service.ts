import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AgentProfile } from 'src/agent/agent.entity';
import { Service } from 'src/agent/service/service.entity';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';
import { Category } from 'src/shared/category/category.entity';
import { Review } from 'src/shared/review/review.entity';
import { Tag } from 'src/shared/tag/tag.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

interface FilterAgentStatsParams {
  minRating?: number;
  maxPrice?: number;
  status?: VerificationStatus;
}

interface SearchServiceFilters {
  categoryIds?: number[];
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  tags?: string[];
  verifiedOnly?: boolean;
  minRating?: number;
}

@Injectable()
export class PublicService {
  constructor(
    @InjectRepository(AgentProfile)
    private readonly agentRepo: Repository<AgentProfile>,

    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,

    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  async searchAgents(
    keyword?: string,
    location?: string,
  ): Promise<AgentProfile[]> {
    const qb: SelectQueryBuilder<AgentProfile> = this.agentRepo
      .createQueryBuilder('agent')
      .leftJoinAndSelect('agent.user', 'user')
      .leftJoinAndSelect('agent.services', 'service')
      .leftJoinAndSelect('agent.reviews', 'review')
      .select([
        'agent',
        'user.id',
        'user.username',
        'user.email',
        'service.id',
        'service.title',
      ])
      .orderBy('agent.follower_count', 'DESC');

    // 🔍 Case-insensitive keyword search (matches bio, username, or service title)
    if (keyword) {
      qb.andWhere(
        '(LOWER(agent.bio) LIKE LOWER(:keyword) OR LOWER(user.username) LIKE LOWER(:keyword) OR LOWER(service.title) LIKE LOWER(:keyword))',
        { keyword: `%${keyword}%` },
      );
    }

    // 📍 Case-insensitive location filter
    if (location) {
      qb.andWhere('LOWER(agent.location) LIKE LOWER(:location)', {
        location: `%${location}%`,
      });
    }

    return qb.getMany();
  }

  async searchServicesAdvanced(
    filters: SearchServiceFilters,
  ): Promise<Service[]> {
    const {
      categoryIds,
      keyword,
      minPrice,
      maxPrice,
      location,
      tags,
      verifiedOnly,
      minRating,
    } = filters;

    const qb: SelectQueryBuilder<Service> = this.serviceRepo
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.category', 'category')
      .leftJoinAndSelect('service.agent', 'agent')
      .leftJoinAndSelect('agent.user', 'user')
      .leftJoinAndSelect('service.tags', 'tag')
      .leftJoinAndSelect('agent.reviews', 'review')
      .select([
        'service',
        'category',
        'tag',
        'agent',
        'user.id',
        'user.email',
        'user.username',
      ]);

    // 🔍 Keyword search
    if (keyword) {
      qb.andWhere(
        '(LOWER(service.title) LIKE LOWER(:keyword) OR LOWER(service.description) LIKE LOWER(:keyword))',
        { keyword: `%${keyword}%` },
      );
    }

    // 🏷️ Multiple categories
    if (categoryIds && categoryIds.length > 0) {
      qb.andWhere('category.id IN (:...categoryIds)', { categoryIds });
    }

    // 💰 Price range
    if (minPrice) qb.andWhere('service.price >= :minPrice', { minPrice });
    if (maxPrice) qb.andWhere('service.price <= :maxPrice', { maxPrice });

    // 📍 Agent location
    if (location) {
      qb.andWhere('LOWER(agent.location) LIKE LOWER(:location)', {
        location: `%${location}%`,
      });
    }

    // 🏷️ Tags
    if (tags && tags.length > 0) {
      qb.andWhere('tag.name IN (:...tags)', { tags });
    }

    // ✅ Verified agents only
    if (verifiedOnly) {
      qb.andWhere('agent.verification_status = :status', {
        status: VerificationStatus.APPROVED,
      });
    }

    // ⭐ Minimum rating filter
    if (minRating) {
      qb.groupBy('service.id')
        .addGroupBy('category.id')
        .addGroupBy('agent.id')
        .addGroupBy('user.id')
        .addGroupBy('tag.id')
        .having('AVG(review.rating) >= :minRating', { minRating });
    }

    qb.orderBy('service.created_at', 'DESC');

    return qb.getMany();
  }

  async filterAgentsByStats({
    minRating,
    maxPrice,
    status,
  }: FilterAgentStatsParams): Promise<AgentProfile[]> {
    // ✅ In PublicService.filterAgentsByStats()
    const qb = this.agentRepo
      .createQueryBuilder('agent')
      .leftJoinAndSelect('agent.user', 'user')
      .leftJoinAndSelect('agent.services', 'service')
      .leftJoinAndSelect('agent.reviews', 'review');

    // ⭐ Filter by average rating using subquery
    if (minRating) {
      qb.andWhere(
        `(SELECT AVG(r.rating) FROM reviews r WHERE r.agent_id = agent.id) >= :minRating`,
        { minRating },
      );
    }

    if (maxPrice) {
      qb.andWhere('service.price <= :maxPrice', { maxPrice });
    }

    if (status) {
      qb.andWhere('agent.verification_status = :status', { status });
    }

    qb.orderBy('agent.id', 'DESC');
    return qb.getMany();
  }

  async getReviewsForAgent(agentId: number) {
    return this.reviewRepo.find({
      where: { agent: { id: agentId } },
      relations: ['customer', 'customer.user'],
      order: { created_at: 'DESC' },
    });
  }

  async getAllCategories() {
    return this.categoryRepo.find({ order: { name: 'ASC' } });
  }

  async getAllTags() {
    return this.tagRepo.find({ order: { name: 'ASC' } });
  }

  async getAgentById(id: number) {
    const agent = await this.agentRepo.findOne({
      where: { id },
      relations: [
        'user',
        'services',
        'reviews',
        'services.category',
        'services.tags',
      ],
    });
    if (!agent) throw new NotFoundException('Agent not found');
    return agent;
  }

  async getServiceById(id: number) {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: ['category', 'tags', 'agent', 'agent.user', 'agent.reviews'],
    });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async getAllServices() {
    return this.serviceRepo.find({
      relations: ['category', 'tags', 'agent', 'agent.user', 'agent.reviews'],
    });
  }

  async getServicesByCategory(categoryId: number): Promise<Service[]> {
    return this.serviceRepo.find({
      where: { category: { id: categoryId } },
      relations: ['category', 'tags', 'agent', 'agent.user', 'agent.reviews'],
    });
  }

  async getFeaturedServices(): Promise<Service[]> {
    return this.serviceRepo.find({
      where: { agent: { verification_status: VerificationStatus.APPROVED } },
      take: 10,
      relations: ['category', 'tags', 'agent', 'agent.user'],
    });
  }

  async getFeaturedAgents(): Promise<AgentProfile[]> {
    return this.agentRepo.find({
      where: { verification_status: VerificationStatus.APPROVED },
      order: { reviews: { rating: 'DESC' } },
      take: 8,
      relations: ['user', 'services', 'reviews'],
    });
  }

  async getTrendingServices(): Promise<Service[]> {
    return this.serviceRepo
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.agent', 'agent')
      .leftJoinAndSelect('agent.user', 'user')
      .leftJoinAndSelect('service.category', 'category')
      .leftJoinAndSelect('service.tags', 'tags')
      .orderBy('service.total_reviews', 'DESC')
      .take(10)
      .getMany();
  }

  async getRelatedServices(serviceId: number): Promise<Service[]> {
    const service = await this.serviceRepo.findOne({
      where: { id: serviceId },
      relations: ['category', 'tags'],
    });

    if (!service || !service.category) {
      throw new NotFoundException('Service or category not found');
    }

    return this.serviceRepo
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.agent', 'agent')
      .leftJoinAndSelect('agent.user', 'user')
      .leftJoinAndSelect('service.category', 'category')
      .leftJoinAndSelect('service.tags', 'tags')
      .where('service.category = :categoryId', {
        categoryId: service.category.id,
      })
      .andWhere('service.id != :serviceId', { serviceId })
      .orderBy('service.total_reviews', 'DESC')
      .take(6)
      .getMany();
  }

  async getServiceReviews(serviceId: number): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { service: { id: serviceId } },
      relations: ['customer', 'customer.user'],
      order: { created_at: 'DESC' },
    });
  }

  async getTopRatedAgents(limit: number): Promise<AgentProfile[]> {
    return this.agentRepo.find({
      where: { verification_status: VerificationStatus.APPROVED },
      order: { reviews: { rating: 'DESC' } },
      take: limit,
      relations: ['user', 'services', 'reviews'],
    });
  }

  async getPlatformStats() {
    const [totalAgents, verifiedAgents, totalServices, totalReviews] =
      await Promise.all([
        this.agentRepo.count(),
        this.agentRepo.count({
          where: { verification_status: VerificationStatus.APPROVED },
        }),
        this.serviceRepo.count(),
        this.reviewRepo.count(),
      ]);

    return {
      totalAgents,
      verifiedAgents,
      totalServices,
      totalReviews,
    };
  }
}
