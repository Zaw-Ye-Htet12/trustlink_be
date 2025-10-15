import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RoomType } from './room-type.entity';

@Injectable()
export class RoomTypeRepository extends Repository<RoomType> {
  constructor(private dataSource: DataSource) {
    super(RoomType, dataSource.createEntityManager());
  }

  async findAllRoomTypes(): Promise<RoomType[]> {
    return this.find({
      relations: ['amenities'],
    });
  }

  async findRoomTypeById(id: number): Promise<RoomType | null> {
    return this.findOne({
      where: { room_type_id: id },
      relations: ['amenities'],
    });
  }
  async findRoomTypeByName(name: string): Promise<RoomType | null> {
    return this.findOne({
      where: { name },
      relations: ['amenities'],
    });
  }

  async findAvailableRoomsByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<RoomType[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date range');
    }

    // Load all rooms (with amenities)
    const allRooms = await this.find({ relations: ['amenities'] });

    // Filter rooms that have at least one available date within the range
    return allRooms.filter((room) => {
      if (!room.available_dates || room.available_dates.length === 0) {
        return false;
      }

      // Convert stored dates to Date objects for comparison
      const availableDates = room.available_dates.map(
        (d) => new Date(d.split('T')[0]),
      );

      // Check if there is at least one date in range
      return availableDates.some((date) => date >= start && date <= end);
    });
  }

  async insertRoomType(roomType: Partial<RoomType>): Promise<RoomType> {
    const newRoomType = this.create(roomType);
    return this.save(newRoomType);
  }

  async updateRoomType(
    id: number,
    data: Partial<RoomType>,
  ): Promise<RoomType | null> {
    const roomType = await this.findRoomTypeById(id);
    if (!roomType) return null;

    Object.assign(roomType, data);
    return this.save(roomType);
  }

  async deleteRoomType(id: number): Promise<boolean> {
    const result = await this.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
