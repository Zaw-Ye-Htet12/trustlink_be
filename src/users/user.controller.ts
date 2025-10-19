import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

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
  // @UseGuards(AuthGuard('jwt'))
  // @Patch('profile')
  // async updateProfile(
  //   @Req() req: RequestWithUser,
  //   @Body() dto: UpdateUserDto,
  // ): Promise<UserResponseDto> {
  //   const user = req.user;
  //   return this.userService.update(user.sub, dto);
  // }

  /** ✅ PATCH /users/change-password — Change user password */
}
