import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Patch,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserResponseDto } from 'src/auth/dto/user-response.dto';
import { Request } from 'express';
import { UserRole } from 'src/common/enums/user-role.enum';

interface RequestWithUser extends Request {
  user: {
    sub: number;
    email: string;
    role: UserRole;
  };
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** ✅ POST /users — Create new user (admin use or testing) */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  /** ✅ GET /users — Get all users (admin only) */
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  /** ✅ GET /users/:id — Public user profile */
  @Get(':id')
  async getPublicProfile(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findPublicProfile(id);
  }

  /** ✅ PATCH /users/profile — Update logged-in user profile */
  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = req.user;
    return this.userService.update(user.sub, dto);
  }

  /** ✅ PATCH /users/change-password — Change user password */
  @UseGuards(AuthGuard('jwt'))
  @Patch('change-password')
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = req.user;
    return this.userService.changePassword(user.sub, dto);
  }

  /** ✅ DELETE /users/deactivate — Deactivate (soft delete) current user */
  @UseGuards(AuthGuard('jwt'))
  @Delete('deactivate')
  async deactivate(@Req() req: RequestWithUser): Promise<{ message: string }> {
    const user = req.user;
    return this.userService.deactivateAccount(user.sub);
  }

  /** ✅ DELETE /users/:id — Permanently delete user (admin use) */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.userService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
