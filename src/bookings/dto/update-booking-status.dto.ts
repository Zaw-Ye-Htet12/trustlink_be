import { IsEnum } from 'class-validator';
import { BookingStatus } from '../booking.entity';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
