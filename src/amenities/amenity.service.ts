import {
  Injectable,
  NotFoundException,
  //   ConflictException,
} from '@nestjs/common';
import { AmenityRepository } from './amenity.repository';
// import { CreateAmenityDto } from './dto/create-amenity.dto';
// import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { Amenity } from './amenity.entity';

@Injectable()
export class AmenityService {
  constructor(private readonly amenityRepository: AmenityRepository) {}

  //   async create(dto: CreateAmenityDto): Promise<Amenity> {
  //     const existing = await this.amenityRepository.findByName(dto.name);
  //     if (existing) {
  //       throw new ConflictException(
  //         `Amenity with name "${dto.name}" already exists`,
  //       );
  //     }
  //     return this.amenityRepository.insertAmenity(dto);
  //   }

  async findAll(): Promise<Amenity[]> {
    return this.amenityRepository.findAllAmenities();
  }

  async findOne(id: number): Promise<Amenity> {
    const amenity = await this.amenityRepository.findAmenityById(id);
    if (!amenity) {
      throw new NotFoundException(`Amenity with ID ${id} not found`);
    }
    return amenity;
  }

  //   async update(id: number, dto: UpdateAmenityDto): Promise<Amenity> {
  //     const amenity = await this.amenityRepository.updateAmenity(id, dto);
  //     if (!amenity) {
  //       throw new NotFoundException(`Amenity with ID ${id} not found`);
  //     }
  //     return amenity;
  //   }

  async remove(id: number): Promise<void> {
    const success = await this.amenityRepository.deleteAmenity(id);
    if (!success) {
      throw new NotFoundException(`Amenity with ID ${id} not found`);
    }
  }
}
