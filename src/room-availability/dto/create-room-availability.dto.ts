import { IsNumber, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateRoomAvailabilityDto {
  @IsNumber()
  room_type_id: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsBoolean()
  is_available?: boolean;
}
