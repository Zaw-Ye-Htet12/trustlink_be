import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerProfile } from './customer.entity';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerProfile)
    private readonly customerRepo: Repository<CustomerProfile>,
  ) {}

  async findAll(): Promise<CustomerProfile[]> {
    return this.customerRepo.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<CustomerProfile> {
    const customer = await this.customerRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(id: number, dto: UpdateCustomerDto): Promise<CustomerProfile> {
    const customer = await this.findOne(id);
    Object.assign(customer, dto);
    return this.customerRepo.save(customer);
  }

  async remove(id: number): Promise<void> {
    const result = await this.customerRepo.delete(id);
    if (!result.affected) throw new NotFoundException('Customer not found');
  }
}
