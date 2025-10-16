import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './booking.entity';
import { BookingRepository } from './booking.repository';
import { RoomTypeModule } from '../room-types/room-type.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), RoomTypeModule],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
  exports: [BookingService, BookingRepository],
})
export class BookingModule {}
