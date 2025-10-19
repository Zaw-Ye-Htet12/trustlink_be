// src/auth/auth.service.ts
import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from '../users/user.repository';
import { UserRole } from '../common/enums/user-role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerProfile } from '../customer/customer.entity';
import { Repository } from 'typeorm';
import { AgentProfile } from '../agent/agent.entity';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterDto } from './dto/register';
import { UserResponseDto } from './dto/user-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private userRepository: UserRepository,
    @InjectRepository(CustomerProfile)
    private readonly customerRepo: Repository<CustomerProfile>,
    @InjectRepository(AgentProfile)
    private readonly agentRepo: Repository<AgentProfile>,
  ) {}

  // Generate Tokens
  async getTokens(userId: number, email: string, role: UserRole) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET') || 'access-secret',
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(payload, {
        secret:
          this.config.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret',
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const newUser = this.userRepository.create({
      email: dto.email,
      username: dto.username,
      password_hash: hashedPassword,
      role: dto.role,
      phone_no: dto.phone,
    });

    const user = await this.userRepository.save(newUser);

    // Create profile based on role
    try {
      if (dto.role === UserRole.CUSTOMER) {
        const customer = this.customerRepo.create({ user });
        await this.customerRepo.save(customer);
      } else if (dto.role === UserRole.AGENT) {
        const agent = this.agentRepo.create({ user });
        await this.agentRepo.save(agent);
      }
    } catch (error) {
      // Rollback user creation if profile creation fails
      await this.userRepository.remove(user);
      throw new InternalServerErrorException(
        `Failed to create user profile: ${error}`,
      );
    }

    // Generate tokens
    const tokens = await this.getTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        phone_no: user.phone_no,
        is_active: user.is_active,
      },
      access_token: tokens.accessToken,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    if (!user.is_active) {
      throw new ForbiddenException('Account is deactivated');
    }

    const pwMatches = await bcrypt.compare(dto.password, user.password_hash);
    if (!pwMatches) {
      throw new ForbiddenException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        phone_no: user.phone_no,
        is_active: user.is_active,
      },
      access_token: tokens.accessToken,
    };
  }

  logout() {
    return {
      message: 'Logged out successfully. Please remove tokens from client.',
    };
  }

  async refreshTokens(userId: number) {
    // Verify user still exists
    const user = await this.userRepository.findUserById(userId);
    if (!user || !user.is_active) {
      throw new ForbiddenException('Access Denied');
    }

    // Generate new tokens
    const tokens = await this.getTokens(user.id, user.email, user.role);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async getCurrentUser(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new ForbiddenException('User not found');
    return user;
  }

  async changePassword(
    userId: number,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new ForbiddenException('User not found');

    const pwMatches = await bcrypt.compare(
      dto.currentPassword,
      user.password_hash,
    );
    if (!pwMatches)
      throw new ForbiddenException('Current password is incorrect');

    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException(
        'New password and confirmation do not match',
      );
    }

    user.password_hash = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }
}
