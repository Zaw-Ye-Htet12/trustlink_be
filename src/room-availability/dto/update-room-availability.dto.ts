import { IsBoolean } from 'class-validator';

export class UpdateRoomAvailabilityDto {
  @IsBoolean()
  is_available: boolean;
}
