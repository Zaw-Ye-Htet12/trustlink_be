import { IsOptional, IsString } from 'class-validator';

export class VerifyAgentDto {
  @IsOptional()
  @IsString()
  admin_notes?: string;
}
