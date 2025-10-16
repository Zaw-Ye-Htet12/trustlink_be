import { Injectable } from '@nestjs/common';
import { DataSource, Repository, Between, In } from 'typeorm';
import { Booking, BookingStatus } from './booking.entity';

@Injectable()
export class BookingRepository extends Repository<Booking> {
  constructor(private dataSource: DataSource) {
    super(Booking, dataSource.createEntityManager());
  }

  async findAllBookings(): Promise<Booking[]> {
    return this.find({
      relations: ['user', 'roomType', 'roomType.amenities'],
      order: { created_at: 'DESC' },
    });
  }

  async findBookingById(id: number): Promise<Booking | null> {
    return this.findOne({
      where: { booking_id: id },
      relations: ['user', 'roomType', 'roomType.amenities'],
    });
  }

  async findBookingsByUserId(userId: number): Promise<Booking[]> {
    return this.find({
      where: { user_id: userId },
      relations: ['roomType', 'roomType.amenities'],
      order: { created_at: 'DESC' },
    });
  }

  async findBookingsByStatus(status: BookingStatus): Promise<Booking[]> {
    return this.find({
      where: { status },
      relations: ['user', 'roomType', 'roomType.amenities'],
      order: { created_at: 'DESC' },
    });
  }

  async findBookingsByRoomTypeId(roomTypeId: number): Promise<Booking[]> {
    return this.find({
      where: { room_type_id: roomTypeId },
      relations: ['user', 'roomType'],
      order: { start_date: 'ASC' },
    });
  }

  async findBookingsByDateRange(
    roomTypeId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Booking[]> {
    return this.createQueryBuilder('booking')
      .where('booking.room_type_id = :roomTypeId', { roomTypeId })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [BookingStatus.PENDING, BookingStatus.APPROVED],
      })
      .andWhere(
        '(booking.start_date BETWEEN :startDate AND :endDate OR booking.end_date BETWEEN :startDate AND :endDate OR (booking.start_date <= :startDate AND booking.end_date >= :endDate))',
        { startDate, endDate },
      )
      .getMany();
  }

  async insertBooking(booking: Partial<Booking>): Promise<Booking> {
    const newBooking = this.create(booking);
    return this.save(newBooking);
  }

  async updateBooking(
    id: number,
    data: Partial<Booking>,
  ): Promise<Booking | null> {
    const booking = await this.findBookingById(id);
    if (!booking) return null;

    Object.assign(booking, data);
    return this.save(booking);
  }

  async deleteBooking(id: number): Promise<boolean> {
    const result = await this.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
