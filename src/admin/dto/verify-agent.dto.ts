import { IsInt, IsOptional, IsString } from 'class-validator';

export class VerifyAgentDto {
  @IsOptional()
  @IsString()
  admin_notes?: string;

  @IsInt()
  agentId: number;
}
