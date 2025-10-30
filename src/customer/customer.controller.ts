import {
  Controller,
  Get,
  Body,
  UseGuards,
  Req,
  Patch,
  Post,
  ParseIntPipe,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { DeleteReviewDto } from './dto/delete-review.dto';

interface RequestWithUser extends Request {
  user: { sub: number };
}

@Controller('customer')
@UseGuards(AuthGuard('jwt'))
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Patch('profile')
  updateProfile(@Req() req: RequestWithUser, @Body() dto: UpdateCustomerDto) {
    return this.customerService.updateProfile(req.user.sub, dto);
  }

  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return this.customerService.getProfile(req.user.sub);
  }

  @Post('reviews')
  createReview(@Req() req: RequestWithUser, @Body() dto: CreateReviewDto) {
    return this.customerService.createReview(req.user.sub, dto);
  }

  @Get('reviews')
  getMyReviews(@Req() req: RequestWithUser) {
    return this.customerService.getMyReviews(req.user.sub);
  }

  @Patch('reviews/:id')
  updateReview(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.customerService.updateReview(req.user.sub, id, dto);
  }

  @Delete('reviews')
  deleteReview(@Req() req: RequestWithUser, @Body() dto: DeleteReviewDto) {
    return this.customerService.deleteReview(req.user.sub, dto.reviewId);
  }
}
