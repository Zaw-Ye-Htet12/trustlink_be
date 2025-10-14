import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // CREATE
  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.insertUser({
      ...dto,
      password: hashedPassword,
    });

    return user;
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
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    if (dto.email) {
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser && existingUser.user_id !== id) {
        throw new ConflictException('User with this email already exists');
      }
    }
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    await this.userRepository.updateUser(id, dto);
    const updatedUser = await this.userRepository.findUserById(id);
    return updatedUser!;
  }

  // // DELETE
  async remove(id: number): Promise<void> {
    const success = await this.userRepository.deleteUser(id);
    if (!success) throw new NotFoundException(`User with ID ${id} not found`);
  }
}
