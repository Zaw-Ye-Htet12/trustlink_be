import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerProfile } from 'src/customer/customer.entity';
import { Repository } from 'typeorm';
import { AgentProfile } from 'src/agent/agent.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(CustomerProfile)
    private readonly customerRepo: Repository<CustomerProfile>,
    @InjectRepository(AgentProfile)
    private readonly agentRepo: Repository<AgentProfile>,
  ) {}

  // CREATE
  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = await this.userRepository.insertUser({
      ...dto,
      password_hash: hashedPassword,
    });

    try {
      if (dto.role === UserRole.CUSTOMER) {
        const customer = this.customerRepo.create({ user: newUser });
        await this.customerRepo.save(customer);
      } else if (dto.role === UserRole.AGENT) {
        const agent = this.agentRepo.create({ user: newUser });
        await this.agentRepo.save(agent);
      }
    } catch (error) {
      await this.userRepository.deleteUser(newUser.id);
      throw new InternalServerErrorException(
        `Failed to create user profile ${error}`,
      );
    }

    return newUser;
  }

  // READ ALL
  async findAll(): Promise<User[]> {
    return this.userRepository.findAllUsers();
  }

  // // READ ONE
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  // // UPDATE
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.userRepository.findByEmail(
        updateUserDto.email,
      );
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        'New password and confirm password do not match',
      );
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.password_hash = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }

  // // DELETE
  async remove(id: number): Promise<void> {
    const success = await this.userRepository.deleteUser(id);
    if (!success) throw new NotFoundException(`User with ID ${id} not found`);
  }
}
