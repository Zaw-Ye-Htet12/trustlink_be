import {
  IsNumber,
  IsDateString,
  IsString,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  room_type_id: number;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  event_name?: string;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;
}
