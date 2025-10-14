import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from '../users/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private userRepository: UserRepository,
  ) {}

  // 🧩 Helper: Generate Tokens
  async getTokens(userId: number, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  // 🧩 Signup
  async signup(dto: SignupDto) {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already exists');

    // Hash password before creating user
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const userDto = { ...dto, password: hashedPassword };

    // Create user
    const newUser = this.userRepository.create(userDto);
    const user = await this.userRepository.save(newUser);

    // Generate tokens
    const tokens = await this.getTokens(user.user_id, user.email);

    return tokens;
  }

  // 🧩 Login
  async login(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new ForbiddenException('Invalid credentials');

    const pwMatches = await bcrypt.compare(dto.password, user.password);
    if (!pwMatches) throw new ForbiddenException('Invalid credentials');

    const tokens = await this.getTokens(user.user_id, user.email);

    return tokens;
  }

  // 🧩 Logout (Stateless - client-side token removal)
  logout() {
    return {
      message: 'Logged out successfully. Please remove tokens from client.',
    };
  }

  // 🧩 Refresh
  async refreshTokens(userId: number) {
    // Verify user still exists
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new ForbiddenException('Access Denied');

    // Generate new tokens
    const tokens = await this.getTokens(user.user_id, user.email);

    return tokens;
  }
}
