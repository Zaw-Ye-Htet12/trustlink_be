import { IsEnum, IsOptional } from 'class-validator';
import { BookingStatus } from '../booking.entity';

export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
