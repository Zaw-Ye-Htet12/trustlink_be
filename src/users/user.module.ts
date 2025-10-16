import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CustomerProfile } from 'src/customer/customer.entity';
import { AgentProfile } from 'src/agent/agent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, CustomerProfile, AgentProfile])],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UsersModule {}
