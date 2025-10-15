// import {
//   Injectable,
//   NotFoundException,
//   BadRequestException,
// } from '@nestjs/common';
// import { RoomAvailabilityRepository } from './room-availability.repository';
// import { RoomTypeRepository } from '../room-types/room-type.repository';
// import { CreateRoomAvailabilityDto } from './dto/create-room-availability.dto';
// import { UpdateRoomAvailabilityDto } from './dto/update-room-availability.dto';
// import { RoomAvailability } from './room-availability.entity';

// @Injectable()
// export class RoomAvailabilityService {
//   constructor(
//     private readonly availabilityRepository: RoomAvailabilityRepository,
//     private readonly roomTypeRepository: RoomTypeRepository,
//   ) {}

//   async create(dto: CreateRoomAvailabilityDto): Promise<RoomAvailability> {
//     const roomType = await this.roomTypeRepository.findRoomTypeById(
//       dto.room_type_id,
//     );
//     if (!roomType) {
//       throw new NotFoundException(
//         `Room type with ID ${dto.room_type_id} not found`,
//       );
//     }

//     const existingAvailability =
//       await this.availabilityRepository.findByRoomTypeAndDate(
//         dto.room_type_id,
//         new Date(dto.date),
//       );

//     if (existingAvailability) {
//       throw new BadRequestException(
//         'Availability for this room type and date already exists',
//       );
//     }

//     return this.availabilityRepository.insertAvailability({
//       room_type_id: dto.room_type_id,
//       date: new Date(dto.date),
//       is_available: dto.is_available ?? true,
//     });
//   }

//   async findByRoomType(roomTypeId: number): Promise<RoomAvailability[]> {
//     return this.availabilityRepository.findByRoomTypeId(roomTypeId);
//   }

//   async findByDateRange(
//     roomTypeId: number,
//     startDate: string,
//     endDate: string,
//   ): Promise<RoomAvailability[]> {
//     return this.availabilityRepository.findByDateRange(
//       roomTypeId,
//       new Date(startDate),
//       new Date(endDate),
//     );
//   }

//   async update(
//     id: number,
//     dto: UpdateRoomAvailabilityDto,
//   ): Promise<RoomAvailability> {
//     const availability = await this.availabilityRepository.updateAvailability(
//       id,
//       dto,
//     );
//     if (!availability) {
//       throw new NotFoundException(`Availability with ID ${id} not found`);
//     }
//     return availability;
//   }

//   async remove(id: number): Promise<void> {
//     const success = await this.availabilityRepository.deleteAvailability(id);
//     if (!success) {
//       throw new NotFoundException(`Availability with ID ${id} not found`);
//     }
//   }
// }
