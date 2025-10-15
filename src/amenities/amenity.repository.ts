import { Injectable } from '@nestjs/common';
import { DataSource, Repository, In } from 'typeorm';
import { Amenity } from './amenity.entity';

@Injectable()
export class AmenityRepository extends Repository<Amenity> {
  constructor(private dataSource: DataSource) {
    super(Amenity, dataSource.createEntityManager());
  }

  async findAllAmenities(): Promise<Amenity[]> {
    return this.find();
  }

  async findAmenityById(id: number): Promise<Amenity | null> {
    return this.findOne({ where: { amenity_id: id } });
  }

  async findAmenitiesByIds(ids: number[]): Promise<Amenity[]> {
    return this.find({ where: { amenity_id: In(ids) } });
  }

  async findByName(name: string): Promise<Amenity | null> {
    return this.findOne({ where: { name } });
  }

  async insertAmenity(amenity: Partial<Amenity>): Promise<Amenity> {
    const newAmenity = this.create(amenity);
    return this.save(newAmenity);
  }

  async updateAmenity(
    id: number,
    data: Partial<Amenity>,
  ): Promise<Amenity | null> {
    const amenity = await this.findAmenityById(id);
    if (!amenity) return null;

    Object.assign(amenity, data);
    return this.save(amenity);
  }

  async deleteAmenity(id: number): Promise<boolean> {
    const result = await this.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
