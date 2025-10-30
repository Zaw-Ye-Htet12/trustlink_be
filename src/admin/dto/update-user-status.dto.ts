import { IsBoolean, IsInt } from 'class-validator';

export class UpdateUserStatusDto {
  @IsBoolean()
  is_active: boolean;

  @IsInt()
  userId: number;
}
