import { IsUrl, IsBoolean, IsOptional } from 'class-validator';

export class AddServiceImageDto {
  @IsUrl()
  image_url: string;

  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;
}
