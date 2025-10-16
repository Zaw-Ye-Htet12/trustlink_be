import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CustomerProfile } from './customer.entity';

@Injectable()
export class CustomerRepository extends Repository<CustomerProfile> {
  constructor(private readonly dataSource: DataSource) {
    super(CustomerProfile, dataSource.createEntityManager());
  }
}
