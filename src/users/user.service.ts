import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';

import { User } from './user.entity';
import { CustomerProfile } from 'src/customer/customer.entity';
import { AgentProfile } from 'src/agent/agent.entity';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,

    @InjectRepository(CustomerProfile)
    private readonly customerRepo: Repository<CustomerProfile>,

    @InjectRepository(AgentProfile)
    private readonly agentRepo: Repository<AgentProfile>,
  ) {}

  /** ✅ Get public profile (safe fields only) */
  async findPublicProfile(userId: number): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { id: userId, is_active: true },
      select: ['id', 'username', 'email', 'role', 'phone_no', 'created_at'],
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** ✅ Create a new user (agent or customer) */
  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create new user entity
    const newUser = await this.userRepository.insertUser({
      ...dto,
      password_hash: hashedPassword,
    });

    try {
      if (dto.role === UserRole.CUSTOMER) {
        const customerProfile = this.customerRepo.create({
          user: newUser,
        });
        await this.customerRepo.save(customerProfile);
      } else if (dto.role === UserRole.AGENT) {
        const agentProfile = this.agentRepo.create({
          user: newUser,
        });
        await this.agentRepo.save(agentProfile);
      }
    } catch (error) {
      // Rollback user if related profile fails
      await this.userRepository.deleteUser(newUser.id);
      throw new InternalServerErrorException(
        `Failed to create user profile: ${error}`,
      );
    }

    return newUser;
  }

  /** ✅ Get all users (admin use) */
  async findAll(): Promise<User[]> {
    return this.userRepository.findAllUsers();
  }

  /** ✅ Get one user by ID */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  /** ✅ Update user basic info */
  // async update(
  //   id: number,
  //   updateUserDto: UpdateUserDto,
  // ): Promise<UserResponseDto> {
  //   const user = await this.userRepository.findOne({ where: { id } });

  //   if (!user) throw new NotFoundException(`User with ID ${id} not found`);

  //   // Validate email uniqueness
  //   if (updateUserDto.email && updateUserDto.email !== user.email) {
  //     const existingEmail = await this.userRepository.findByEmail(
  //       updateUserDto.email,
  //     );
  //     if (existingEmail) throw new ConflictException('Email already exists');
  //   }

  //   Object.assign(user, updateUserDto);
  //   const updatedUser = await this.userRepository.save(user);

  //   return updatedUser;
  // }

  /** ✅ Change password securely */
  // async changePassword(
  //   userId: number,
  //   changePasswordDto: ChangePasswordDto,
  // ): Promise<{ message: string }> {
  //   const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

  //   if (newPassword !== confirmPassword) {
  //     throw new BadRequestException(
  //       'New password and confirm password do not match',
  //     );
  //   }

  //   const user = await this.userRepository.findOne({ where: { id: userId } });
  //   if (!user) throw new NotFoundException('User not found');

  //   const isPasswordValid = await bcrypt.compare(
  //     currentPassword,
  //     user.password_hash,
  //   );
  //   if (!isPasswordValid)
  //     throw new UnauthorizedException('Current password is incorrect');

  //   user.password_hash = await bcrypt.hash(newPassword, 10);
  //   await this.userRepository.save(user);

  //   return { message: 'Password changed successfully' };
  // }
}
