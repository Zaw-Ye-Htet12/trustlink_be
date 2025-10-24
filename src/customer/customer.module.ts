import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerProfile } from './customer.entity';
import { AgentProfile } from 'src/agent/agent.entity';
import { Review } from 'src/shared/review/review.entity';
import { Service } from 'src/agent/service/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerProfile, AgentProfile, Review, Service]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
