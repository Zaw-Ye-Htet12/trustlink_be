import { AddAvailableDatesDto } from './add-available-dates.dto';
import { PartialType } from '@nestjs/swagger';

export class RemoveAvailableDatesDto extends PartialType(
  AddAvailableDatesDto,
) {}
