import { IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';

export class AddServiceTagsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  tag_ids: number[];
}
