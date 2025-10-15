import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmenityService } from './amenity.service';
import { AmenityController } from './amenity.controller';
import { Amenity } from './amenity.entity';
import { AmenityRepository } from './amenity.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Amenity])],
  controllers: [AmenityController],
  providers: [AmenityService, AmenityRepository],
  exports: [AmenityService, AmenityRepository],
})
export class AmenityModule {}
