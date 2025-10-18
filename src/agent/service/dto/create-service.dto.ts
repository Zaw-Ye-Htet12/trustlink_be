import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { LocationType } from 'src/common/enums/location-type.enum';
import { PricingType } from 'src/common/enums/pricing-type.enum';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  category_id: number;

  @IsEnum(PricingType)
  pricing_type: PricingType;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsEnum(LocationType)
  location_type: LocationType;

  @IsOptional()
  @IsString()
  service_area?: string;
}
