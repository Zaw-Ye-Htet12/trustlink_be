import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CreateUserDto } from './create-user.dto';

// Option 1: Use PartialType to automatically make all CreateUserDto fields optional
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;

  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  username?: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone_no?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either customer or agent' })
  role?: UserRole;

  @IsOptional()
  @IsString({ message: 'Profile photo URL must be a string' })
  profile_photo_url?: string;
}
