import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RoomType } from './room-type.entity';

@Injectable()
export class RoomTypeRepository extends Repository<RoomType> {
  constructor(private dataSource: DataSource) {
    super(RoomType, dataSource.createEntityManager());
  }

  async findAllRoomTypes(): Promise<RoomType[]> {
    return this.find();
  }

  async findRoomTypeById(id: number): Promise<RoomType | null> {
    return this.findOne({
      where: { room_type_id: id },
      relations: ['availability'],
    });
  }

  async findAvailableRooms(
    startDate: Date,
    endDate: Date,
  ): Promise<RoomType[]> {
    return this.createQueryBuilder('room')
      .leftJoinAndSelect('room.availability', 'availability')
      .where('availability.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('availability.is_available = :available', { available: true })
      .getMany();
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
