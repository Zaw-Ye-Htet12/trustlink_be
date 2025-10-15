import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RoomTypeRepository } from './room-type.repository';
import { AmenityRepository } from '../amenities/amenity.repository';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { AddAvailableDatesDto } from './dto/add-available-dates.dto';
import { RemoveAvailableDatesDto } from './dto/remove-available-dates.dto';
import { RoomType } from './room-type.entity';

@Injectable()
export class RoomTypeService {
  constructor(
    private readonly roomTypeRepository: RoomTypeRepository,
    private readonly amenityRepository: AmenityRepository,
  ) {}

  async create(dto: CreateRoomTypeDto): Promise<RoomType> {
    await this.findRoomTypeByName(dto.name);
    const roomType = this.roomTypeRepository.create({
      name: dto.name,
      description: dto.description,
      capacity: dto.capacity,
      price_per_day: dto.price_per_day,
      address: dto.address,
      images: dto.images,
      available_dates: dto.available_dates || [],
    });

    // Add amenities if provided
    if (dto.amenityIds && dto.amenityIds.length > 0) {
      const amenities = await this.amenityRepository.findAmenitiesByIds(
        dto.amenityIds,
      );
      if (amenities.length !== dto.amenityIds.length) {
        throw new NotFoundException('One or more amenities not found');
      }
      roomType.amenities = amenities;
    }

    return this.roomTypeRepository.save(roomType);
  }

  async findAll(): Promise<RoomType[]> {
    return this.roomTypeRepository.findAllRoomTypes();
  }

  async findOne(id: number): Promise<RoomType> {
    const roomType = await this.roomTypeRepository.findRoomTypeById(id);
    if (!roomType) {
      throw new NotFoundException(`Room type with ID ${id} not found`);
    }
    return roomType;
  }
  async findRoomTypeByName(name: string) {
    const roomType = await this.roomTypeRepository.findRoomTypeByName(name);
    if (roomType) {
      throw new NotFoundException(`Room type with name ${name} already exists`);
    }
    return;
  }
  async findAvailableRooms(
    startDate: string,
    endDate: string,
  ): Promise<RoomType[]> {
    if (!startDate || !endDate) {
      throw new BadRequestException('Start date and end date are required');
    }
    return this.roomTypeRepository.findAvailableRoomsByDateRange(
      startDate,
      endDate,
    );
  }

  async update(id: number, dto: UpdateRoomTypeDto): Promise<RoomType> {
    const roomType = await this.roomTypeRepository.findRoomTypeById(id);
    if (!roomType) {
      throw new NotFoundException(`Room type with ID ${id} not found`);
    }

    // Update basic fields
    if (dto.name !== undefined) roomType.name = dto.name;
    if (dto.description !== undefined) roomType.description = dto.description;
    if (dto.capacity !== undefined) roomType.capacity = dto.capacity;
    if (dto.price_per_day !== undefined)
      roomType.price_per_day = dto.price_per_day;
    if (dto.address !== undefined) roomType.address = dto.address;
    if (dto.images !== undefined) roomType.images = dto.images;
    if (dto.available_dates !== undefined)
      roomType.available_dates = dto.available_dates;

    // Update amenities if provided
    if (dto.amenityIds !== undefined) {
      if (dto.amenityIds.length > 0) {
        const amenities = await this.amenityRepository.findAmenitiesByIds(
          dto.amenityIds,
        );
        if (amenities.length !== dto.amenityIds.length) {
          throw new NotFoundException('One or more amenities not found');
        }
        roomType.amenities = amenities;
      } else {
        roomType.amenities = [];
      }
    }

    return this.roomTypeRepository.save(roomType);
  }

  async addAvailableDates(
    id: number,
    dto: AddAvailableDatesDto,
  ): Promise<RoomType> {
    const roomType = await this.roomTypeRepository.findRoomTypeById(id);
    if (!roomType) {
      throw new NotFoundException(`Room type with ID ${id} not found`);
    }

    const currentDates = roomType.available_dates || [];
    const newDates = [...new Set([...currentDates, ...dto.dates])]; // Remove duplicates
    roomType.available_dates = newDates.sort();

    return this.roomTypeRepository.save(roomType);
  }

  async removeAvailableDates(
    id: number,
    dto: RemoveAvailableDatesDto,
  ): Promise<RoomType> {
    const roomType = await this.roomTypeRepository.findRoomTypeById(id);
    if (!roomType) {
      throw new NotFoundException(`Room type with ID ${id} not found`);
    }

    const currentDates = roomType.available_dates || [];
    roomType.available_dates = currentDates.filter(
      (date) => !dto.dates?.includes(date),
    );

    return this.roomTypeRepository.save(roomType);
  }

  async remove(id: number): Promise<void> {
    const success = await this.roomTypeRepository.deleteRoomType(id);
    if (!success) {
      throw new NotFoundException(`Room type with ID ${id} not found`);
    }
  }
}
