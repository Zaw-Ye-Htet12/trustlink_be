import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  MaxLength,
  IsDateString,
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

  @IsArray()
  @IsDateString({}, { each: true })
  available_dates?: string[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  amenityIds?: number[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
