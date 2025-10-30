import { IsNumber, IsPositive } from 'class-validator';

export class DeleteServiceDTO {
  @IsNumber()
  @IsPositive()
  serviceId: number;
}
