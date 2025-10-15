import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomTypeService } from './room-type.service';
import { RoomTypeController } from './room-type.controller';
import { RoomType } from './room-type.entity';
import { RoomTypeRepository } from './room-type.repository';
import { AmenityModule } from '../amenities/amenity.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoomType]), AmenityModule],
  controllers: [RoomTypeController],
  providers: [RoomTypeService, RoomTypeRepository],
  exports: [RoomTypeService, RoomTypeRepository],
})
export class RoomTypeModule {}
