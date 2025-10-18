import { Injectable } from '@nestjs/common';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';
import { DataSource, Repository } from 'typeorm';
import { AgentProfile } from './agent.entity';

export interface FindAgentsOptions {
  status?: VerificationStatus;
  location?: string;
  service_area?: string;
  search?: string;
  skip?: number;
  take?: number;
}

@Injectable()
export class AgentRepository extends Repository<AgentProfile> {
  constructor(private dataSource: DataSource) {
    super(AgentProfile, dataSource.createEntityManager());
  }

  async findByUserId(userId: number): Promise<AgentProfile | null> {
    return this.findOne({
      where: { user: { id: userId } },
      relations: ['users'],
    });
  }

  async findAgents(
    options: FindAgentsOptions,
  ): Promise<[AgentProfile[], number]> {
    const {
      status,
      location,
      service_area,
      search,
      skip = 0,
      take = 10,
    } = options;

    const queryBuilder = this.createQueryBuilder('agent')
      .leftJoinAndSelect('agent.user', 'users')
      .leftJoinAndSelect('agent.services', 'services')
      .leftJoinAndSelect('agent.reviews', 'reviews');

    if (status) {
      queryBuilder.andWhere('agent.verification_status = :status', { status });
    }

    if (location) {
      queryBuilder.andWhere('agent.location LIKE :location', {
        location: `%${location}%`,
      });
    }

    if (service_area) {
      queryBuilder.andWhere('agent.service_area LIKE :service_area', {
        service_area: `%${service_area}%`,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(user.username LIKE :search OR agent.bio LIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy('agent.created_at', 'DESC').skip(skip).take(take);

    return queryBuilder.getManyAndCount();
  }

  async updateVerificationStatus(
    id: number,
    status: VerificationStatus,
  ): Promise<boolean> {
    const result = await this.update(id, { verification_status: status });
    return result.affected! > 0;
  }
}
