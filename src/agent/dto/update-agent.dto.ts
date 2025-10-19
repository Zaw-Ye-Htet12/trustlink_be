import { IsOptional, IsString, IsNumber, IsEmail } from 'class-validator';

export class UpdateAgentDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  years_of_experience?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  service_area?: string;

  @IsOptional()
  @IsString()
  verification_status?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  username?: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone_no?: string;

  @IsOptional()
  @IsString({ message: 'Profile photo URL must be a string' })
  profile_photo_url?: string;
}
