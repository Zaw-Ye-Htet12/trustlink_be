import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerProfile } from './customer.entity';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { AgentProfile } from 'src/agent/agent.entity';
import { Review } from 'src/shared/review/review.entity';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CustomerProfileResponse } from './dto/response/customer-profile.dto';
import { Service } from 'src/agent/service/service.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerProfile)
    private readonly customerRepo: Repository<CustomerProfile>,

    @InjectRepository(AgentProfile)
    private readonly agentRepo: Repository<AgentProfile>,

    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,

    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async getProfile(userId: number) {
    const profile = await this.customerRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) throw new NotFoundException('Customer profile not found');
    return profile;
  }

  async updateProfile(
    userId: number,
    dto: UpdateCustomerDto,
  ): Promise<CustomerProfileResponse | null> {
    const profile = await this.customerRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) throw new NotFoundException('Customer profile not found');

    // 🔹 Update CustomerProfile fields
    if (dto.location) profile.location = dto.location;
    if (dto.bio) profile.bio = dto.bio;

    // 🔹 Update User fields
    const user = profile.user;
    if (dto.email) user.email = dto.email;
    if (dto.username) user.username = dto.username;
    if (dto.phone_no) user.phone_no = dto.phone_no;
    if (dto.profile_photo_url) user.profile_photo_url = dto.profile_photo_url;

    // 🔹 Save both entities in one go (same connection)
    await this.customerRepo.manager.transaction(async (manager) => {
      await manager.save(user);
      await manager.save(profile);
    });

    // 🔹 Re-fetch updated profile with relations
    const updated = await this.customerRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    return updated;
  }

  async createReview(userId: number, dto: CreateReviewDto): Promise<Review> {
    const customer = await this.customerRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!customer) throw new NotFoundException('Customer profile not found');

    const agent = await this.agentRepo.findOne({
      where: { id: dto.agentId },
    });
    if (!agent) throw new NotFoundException('Agent not found');

    let targetService: Service | null = null;
    if (dto.serviceId) {
      targetService = await this.serviceRepo.findOne({
        where: { id: dto.serviceId, agent: { id: dto.agentId } },
      });
      if (!targetService) {
        throw new ForbiddenException('Service does not belong to this agent');
      }
    }

    // 4️⃣ Check for existing review (agent or service)
    const whereCondition: Record<string, any> = {
      agent: { id: dto.agentId },
      customer: { id: customer.id },
    };
    if (dto.serviceId) {
      whereCondition.service = { id: dto.serviceId };
    } else {
      whereCondition.service = null;
    }

    const existingReview = await this.reviewRepo.findOne({
      where: whereCondition,
      relations: ['agent', 'customer', 'service'],
    });

    if (existingReview) {
      throw new ForbiddenException(
        dto.serviceId
          ? 'You have already reviewed this service'
          : 'You have already reviewed this agent',
      );
    }

    // 5️⃣ Create new review entity
    const review = this.reviewRepo.create({
      title: dto.title,
      rating: dto.rating,
      comment: dto.comment,
      customer,
      agent,
      service: targetService ?? undefined,
    });

    // 6️⃣ Save everything in transaction
    return this.reviewRepo.manager.transaction(async (manager) => {
      const savedReview = await manager.save(review);

      // Increment counts
      agent.total_reviews += 1;
      await manager.save(agent);

      if (targetService) {
        targetService.total_reviews += 1;
        await manager.save(targetService);
      }

      return savedReview;
    });
  }

  async updateReview(userId: number, reviewId: number, dto: UpdateReviewDto) {
    const review = await this.reviewRepo.findOne({
      where: { id: reviewId },
      relations: ['customer', 'customer.user'],
    });
    if (!review) throw new NotFoundException('Review not found');

    if (review.customer.user.id !== userId)
      throw new ForbiddenException('You can only edit your own reviews');

    Object.assign(review, dto);
    return this.reviewRepo.save(review);
  }

  async deleteReview(userId: number, reviewId: number) {
    const review = await this.reviewRepo.findOne({
      where: { id: reviewId },
      relations: ['customer', 'customer.user'],
    });
    if (!review) throw new NotFoundException('Review not found');

    if (review.customer.user.id !== userId)
      throw new ForbiddenException('You can only delete your own reviews');

    return this.reviewRepo.remove(review);
  }
}
