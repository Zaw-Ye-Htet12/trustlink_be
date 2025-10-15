import { IsArray, IsDateString } from 'class-validator';

export class AddAvailableDatesDto {
  @IsArray()
  @IsDateString({}, { each: true })
  dates: string[];
}
