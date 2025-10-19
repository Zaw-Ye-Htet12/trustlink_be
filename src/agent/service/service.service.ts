import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { AgentProfile } from '../agent.entity';
import { Category } from 'src/shared/category/category.entity';
import { Tag } from 'src/shared/tag/tag.entity';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './service.entity';
import { ServiceImage } from 'src/shared/service_image/service_image.entity';
import { AddServiceImageDto } from './dto/add-service-image.dto';
import { AddServiceTagsDto } from './dto/add-service-tags.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,

    @InjectRepository(AgentProfile)
    private readonly agentRepo: Repository<AgentProfile>,

    @InjectRepository(ServiceImage)
    private readonly imageRepo: Repository<ServiceImage>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  /** ✅ Create new service for logged-in agent */
  async create(userId: number, dto: CreateServiceDto): Promise<Service> {
    const agent = await this.agentRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!agent) throw new ForbiddenException('Agent profile not found');

    const category = await this.categoryRepo.findOne({
      where: { id: dto.category_id },
    });
    if (!category) throw new BadRequestException('Invalid category ID');

    const service = this.serviceRepo.create({
      ...dto,
      agent_id: agent.id,
    });

    return this.serviceRepo.save(service);
  }

  /** ✅ Get all services by agent */
  async findAllByAgent(userId: number): Promise<Service[]> {
    const agent = await this.agentRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!agent) throw new ForbiddenException('Agent profile not found');

    return this.serviceRepo.find({
      where: { agent_id: agent.id },
      relations: ['images', 'category', 'tags'],
      order: { created_at: 'DESC' },
    });
  }

  /** ✅ Get single service */
  async findOneByAgent(userId: number, id: number): Promise<Service> {
    const agent = await this.agentRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!agent) throw new ForbiddenException('Agent profile not found');

    const service = await this.serviceRepo.findOne({
      where: { id, agent_id: agent.id },
      relations: ['images', 'category'],
    });

    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  /** ✅ Update service */
  async update(
    userId: number,
    id: number,
    dto: UpdateServiceDto,
  ): Promise<Service> {
    const service = await this.findOneByAgent(userId, id);
    Object.assign(service, dto);
    return this.serviceRepo.save(service);
  }

  /** ✅ Delete service */
  async remove(userId: number, id: number): Promise<{ message: string }> {
    const service = await this.findOneByAgent(userId, id);
    await this.serviceRepo.remove(service);
    return { message: 'Service deleted successfully' };
  }

  /** ✅ Add service images */
  async addImages(
    userId: number,
    serviceId: number,
    dto: AddServiceImageDto,
  ): Promise<ServiceImage> {
    const service = await this.findOneByAgent(userId, serviceId);
    const image = this.imageRepo.create({
      service_id: service.id,
      image_url: dto.image_url,
      is_primary: dto.is_primary ?? false,
    });
    return this.imageRepo.save(image);
  }

  /** ✅ Get service images */
  async getImages(userId: number, serviceId: number): Promise<ServiceImage[]> {
    await this.findOneByAgent(userId, serviceId);
    return this.imageRepo.find({ where: { service_id: serviceId } });
  }

  /** ✅ Add tags to a service */
  async addTags(
    userId: number,
    serviceId: number,
    dto: AddServiceTagsDto,
  ): Promise<{ message: string }> {
    const service = await this.findOneByAgent(userId, serviceId);

    const validTags = await this.tagRepo.find({
      where: { id: In(dto.tag_ids) },
    });
    if (validTags.length !== dto.tag_ids.length) {
      throw new BadRequestException('Some tags are invalid');
    }

    service.tags = validTags;
    await this.serviceRepo.save(service);

    return { message: 'Tags added successfully' };
  }

  /** ✅ Get tags of a service */
  /** ✅ Get tags of a service */
  async getTags(userId: number, serviceId: number) {
    const service = await this.findOneByAgent(userId, serviceId);

    const serviceWithTags = await this.serviceRepo.findOne({
      where: { id: service.id },
      relations: ['tags'],
    });

    if (!serviceWithTags) throw new NotFoundException('Service not found');
    return serviceWithTags.tags;
  }
}
