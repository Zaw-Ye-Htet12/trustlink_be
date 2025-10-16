import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { BookingRepository } from './booking.repository';
import { RoomTypeRepository } from '../room-types/room-type.repository';
import { CreateBookingDto } from './dto/create-booking.dto';
// import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { Booking, BookingStatus } from './booking.entity';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly roomTypeRepository: RoomTypeRepository,
  ) {}

  async create(userId: number, dto: CreateBookingDto): Promise<Booking> {
    // Validate room type exists
    const roomType = await this.roomTypeRepository.findRoomTypeById(
      dto.room_type_id,
    );
    if (!roomType) {
      throw new NotFoundException(
        `Room type with ID ${dto.room_type_id} not found`,
      );
    }

    // Validate dates
    const startDate = new Date(dto.start_date);
    const endDate = new Date(dto.end_date);

    if (startDate >= endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    if (startDate < new Date()) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    // Check if dates are available
    const requestedDates = this.getDateRange(startDate, endDate);
    const availableDates = roomType.available_dates || [];

    const unavailableDates = requestedDates.filter(
      (date) => !availableDates.includes(date),
    );

    if (unavailableDates.length > 0) {
      throw new BadRequestException(
        `The following dates are not available: ${unavailableDates.join(', ')}`,
      );
    }

    // Check for conflicting bookings
    const conflictingBookings =
      await this.bookingRepository.findBookingsByDateRange(
        dto.room_type_id,
        startDate,
        endDate,
      );

    if (conflictingBookings.length > 0) {
      throw new BadRequestException(
        'This room is already booked for the selected dates',
      );
    }

    // Calculate total price
    const numberOfDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const totalPrice = Number(roomType.price_per_day) * numberOfDays;

    // Create booking
    const booking = this.bookingRepository.create({
      user_id: userId,
      room_type_id: dto.room_type_id,
      event_name: dto.event_name,
      start_date: startDate,
      end_date: endDate,
      total_price: totalPrice,
      status: BookingStatus.PENDING,
    });

    return this.bookingRepository.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.findAllBookings();
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findBookingById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async findByUser(userId: number): Promise<Booking[]> {
    return this.bookingRepository.findBookingsByUserId(userId);
  }

  async findByStatus(status: BookingStatus): Promise<Booking[]> {
    return this.bookingRepository.findBookingsByStatus(status);
  }

  // async updateStatus(
  //   id: number,
  //   dto: UpdateBookingStatusDto,
  //   userId?: number,
  //   isAdmin?: boolean,
  // ): Promise<Booking> {
  //   const booking = await this.bookingRepository.findBookingById(id);
  //   if (!booking) {
  //     throw new NotFoundException(`Booking with ID ${id} not found`);
  //   }

  //   // Only admin can approve/reject, user can cancel their own booking
  //   if (
  //     dto.status === BookingStatus.APPROVED ||
  //     dto.status === BookingStatus.REJECTED
  //   ) {
  //     if (!isAdmin) {
  //       throw new ForbiddenException(
  //         'Only admins can approve or reject bookings',
  //       );
  //     }
  //   }

  //   if (dto.status === BookingStatus.CANCELLED) {
  //     if (!isAdmin && booking.user_id !== userId) {
  //       throw new ForbiddenException('You can only cancel your own bookings');
  //     }
  //     if (booking.status === BookingStatus.COMPLETED) {
  //       throw new BadRequestException('Cannot cancel a completed booking');
  //     }
  //   }

  //   // If approving, remove dates from room availability
  //   if (
  //     dto.status === BookingStatus.APPROVED &&
  //     booking.status !== BookingStatus.APPROVED
  //   ) {
  //     await this.removeBookedDatesFromAvailability(booking);
  //   }

  //   // If cancelling or rejecting, add dates back to availability
  //   if (
  //     (dto.status === BookingStatus.CANCELLED ||
  //       dto.status === BookingStatus.REJECTED) &&
  //     booking.status === BookingStatus.APPROVED
  //   ) {
  //     await this.addDatesBackToAvailability(booking);
  //   }

  //   const updatedBooking = await this.bookingRepository.updateBooking(id, {
  //     status: dto.status,
  //   });

  //   return updatedBooking;
  // }

  async remove(id: number, userId?: number, isAdmin?: boolean): Promise<void> {
    const booking = await this.bookingRepository.findBookingById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // Only admin or the user who created the booking can delete it
    if (!isAdmin && booking.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own bookings');
    }

    // Only allow deletion if booking is pending or rejected
    if (
      booking.status === BookingStatus.APPROVED ||
      booking.status === BookingStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'Cannot delete approved or completed bookings. Please cancel instead.',
      );
    }

    const success = await this.bookingRepository.deleteBooking(id);
    if (!success) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
  }

  private getDateRange(startDate: Date, endDate: Date): string[] {
    const dates: string[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  private async removeBookedDatesFromAvailability(
    booking: Booking,
  ): Promise<void> {
    const roomType = await this.roomTypeRepository.findRoomTypeById(
      booking.room_type_id,
    );
    if (!roomType) return;

    const bookedDates = this.getDateRange(
      new Date(booking.start_date),
      new Date(booking.end_date),
    );
    const availableDates = roomType.available_dates || [];
    const updatedDates = availableDates.filter(
      (date) => !bookedDates.includes(date),
    );

    await this.roomTypeRepository.updateRoomType(booking.room_type_id, {
      available_dates: updatedDates,
    });
  }

  private async addDatesBackToAvailability(booking: Booking): Promise<void> {
    const roomType = await this.roomTypeRepository.findRoomTypeById(
      booking.room_type_id,
    );
    if (!roomType) return;

    const bookedDates = this.getDateRange(
      new Date(booking.start_date),
      new Date(booking.end_date),
    );
    const availableDates = roomType.available_dates || [];
    const updatedDates = [
      ...new Set([...availableDates, ...bookedDates]),
    ].sort();

    await this.roomTypeRepository.updateRoomType(booking.room_type_id, {
      available_dates: updatedDates,
    });
  }
}
