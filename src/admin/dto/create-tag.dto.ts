import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;
}
