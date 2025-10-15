import {
  Controller,
  Get,
  //   Post,
  Body,
  Param,
  Delete,
  //   Put,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AmenityService } from './amenity.service';
// import { CreateAmenityDto } from './dto/create-amenity.dto';
// import { UpdateAmenityDto } from './dto/update-amenity.dto';

@Controller('amenities')
export class AmenityController {
  constructor(private readonly amenityService: AmenityService) {}

  //   @Post()
  //   @UseGuards(AuthGuard('jwt'))
  //   create(@Body() createAmenityDto: CreateAmenityDto) {
  //     return this.amenityService.create(createAmenityDto);
  //   }

  @Get()
  findAll() {
    return this.amenityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.amenityService.findOne(id);
  }

  //   @Put(':id')
  //   @UseGuards(AuthGuard('jwt'))
  //   update(
  //     @Param('id', ParseIntPipe) id: number,
  //     @Body() updateAmenityDto: UpdateAmenityDto,
  //   ) {
  //     return this.amenityService.update(id, updateAmenityDto);
  //   }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.amenityService.remove(id);
  }
}
