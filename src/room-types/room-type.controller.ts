import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoomTypeService } from './room-type.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { AddAvailableDatesDto } from './dto/add-available-dates.dto';
import { RemoveAvailableDatesDto } from './dto/remove-available-dates.dto';

@Controller('room-types')
export class RoomTypeController {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createRoomTypeDto: CreateRoomTypeDto) {
    return this.roomTypeService.create(createRoomTypeDto);
  }

  @Get()
  findAll() {
    return this.roomTypeService.findAll();
  }

  @Get('available')
  findAvailable(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.roomTypeService.findAvailableRooms(startDate, endDate);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomTypeService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomTypeDto: UpdateRoomTypeDto,
  ) {
    return this.roomTypeService.update(id, updateRoomTypeDto);
  }

  @Patch(':id/available-dates/add')
  @UseGuards(AuthGuard('jwt'))
  addAvailableDates(
    @Param('id', ParseIntPipe) id: number,
    @Body() addDatesDto: AddAvailableDatesDto,
  ) {
    return this.roomTypeService.addAvailableDates(id, addDatesDto);
  }

  @Patch(':id/available-dates/remove')
  @UseGuards(AuthGuard('jwt'))
  removeAvailableDates(
    @Param('id', ParseIntPipe) id: number,
    @Body() removeDatesDto: RemoveAvailableDatesDto,
  ) {
    return this.roomTypeService.removeAvailableDates(id, removeDatesDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomTypeService.remove(id);
  }
}
