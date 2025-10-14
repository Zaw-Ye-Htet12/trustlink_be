import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateRoomTypeDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @IsNumber()
  @Min(0)
  price_per_day: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsString()
  amenities?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
