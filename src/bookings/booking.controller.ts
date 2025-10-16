import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  //   Patch,
  ParseIntPipe,
  UseGuards,
  Req,
  //   Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
// import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { BookingStatus } from './booking.entity';

interface RequestWithUser extends Request {
  user: {
    sub: number;
    email: string;
    role: string;
    isAdmin: boolean;
  };
}

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.sub;
    return this.bookingService.create(userId, createBookingDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req: RequestWithUser) {
    const isAdmin = req.user.isAdmin;
    if (isAdmin) {
      return this.bookingService.findAll();
    }
    // Non-admin users only see their own bookings
    return this.bookingService.findByUser(req.user.sub);
  }

  @Get('status/:status')
  @UseGuards(AuthGuard('jwt'))
  findByStatus(
    @Param('status') status: BookingStatus,
    @Req() req: RequestWithUser,
  ) {
    if (!req.user.isAdmin) {
      throw new Error('Only admins can filter bookings by status');
    }
    return this.bookingService.findByStatus(status);
  }

  @Get('my-bookings')
  @UseGuards(AuthGuard('jwt'))
  findMyBookings(@Req() req: RequestWithUser) {
    return this.bookingService.findByUser(req.user.sub);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.findOne(id);
  }

  //   @Patch(':id/status')
  //   @UseGuards(AuthGuard('jwt'))
  //   updateStatus(
  //     @Param('id', ParseIntPipe) id: number,
  //     @Body() updateStatusDto: UpdateBookingStatusDto,
  //     @Req() req: RequestWithUser,
  //   ) {
  //     return this.bookingService.updateStatus(
  //       id,
  //       updateStatusDto,
  //       req.user.sub,
  //       req.user.isAdmin,
  //     );
  //   }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.bookingService.remove(id, req.user.sub, req.user.isAdmin);
  }
}
