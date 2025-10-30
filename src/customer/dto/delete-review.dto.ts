import { IsInt } from 'class-validator';

export class DeleteReviewDto {
  @IsInt()
  reviewId: number;
}
