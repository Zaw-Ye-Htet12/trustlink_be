// import { Injectable } from '@nestjs/common';
// import { DataSource, Repository } from 'typeorm';
// import { RoomAvailability } from './room-availability.entity';

// @Injectable()
// export class RoomAvailabilityRepository extends Repository<RoomAvailability> {
//   constructor(private dataSource: DataSource) {
//     super(RoomAvailability, dataSource.createEntityManager());
//   }

//   async findByRoomTypeId(roomTypeId: number): Promise<RoomAvailability[]> {
//     return this.find({ where: { room_type_id: roomTypeId } });
//   }

//   async findByRoomTypeAndDate(
//     roomTypeId: number,
//     date: Date,
//   ): Promise<RoomAvailability | null> {
//     return this.findOne({
//       where: {
//         room_type_id: roomTypeId,
//         date,
//       },
//     });
//   }

//   async findByDateRange(
//     roomTypeId: number,
//     startDate: Date,
//     endDate: Date,
//   ): Promise<RoomAvailability[]> {
//     return this.createQueryBuilder('availability')
//       .where('availability.room_type_id = :roomTypeId', { roomTypeId })
//       .andWhere('availability.date BETWEEN :startDate AND :endDate', {
//         startDate,
//         endDate,
//       })
//       .getMany();
//   }

//   async insertAvailability(
//     data: Partial<RoomAvailability>,
//   ): Promise<RoomAvailability> {
//     const availability = this.create(data);
//     return this.save(availability);
//   }

//   async updateAvailability(
//     id: number,
//     data: Partial<RoomAvailability>,
//   ): Promise<RoomAvailability | null> {
//     const availability = await this.findOne({
//       where: { availability_id: id },
//     });
//     if (!availability) return null;

//     Object.assign(availability, data);
//     return this.save(availability);
//   }

//   async deleteAvailability(id: number): Promise<boolean> {
//     const result = await this.delete(id);
//     return (result.affected ?? 0) > 0;
//   }
// }
