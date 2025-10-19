import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerProfile } from './customer.entity';
import { AgentProfile } from 'src/agent/agent.entity';
import { Review } from 'src/shared/review/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerProfile, AgentProfile, Review])],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
