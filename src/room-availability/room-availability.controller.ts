// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Delete,
//   Put,
//   ParseIntPipe,
//   Query,
//   UseGuards,
// } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { RoomAvailabilityService } from './room-availability.service';
// import { CreateRoomAvailabilityDto } from './dto/create-room-availability.dto';
// import { UpdateRoomAvailabilityDto } from './dto/update-room-availability.dto';

// @Controller('room-availability')
// export class RoomAvailabilityController {
//   constructor(private readonly availabilityService: RoomAvailabilityService) {}

//   @Post()
//   @UseGuards(AuthGuard('jwt'))
//   create(@Body() createDto: CreateRoomAvailabilityDto) {
//     return this.availabilityService.create(createDto);
//   }

//   @Get('room-type/:roomTypeId')
//   findByRoomType(@Param('roomTypeId', ParseIntPipe) roomTypeId: number) {
//     return this.availabilityService.findByRoomType(roomTypeId);
//   }

//   @Get('room-type/:roomTypeId/date-range')
//   findByDateRange(
//     @Param('roomTypeId', ParseIntPipe) roomTypeId: number,
//     @Query('startDate') startDate: string,
//     @Query('endDate') endDate: string,
//   ) {
//     return this.availabilityService.findByDateRange(
//       roomTypeId,
//       startDate,
//       endDate,
//     );
//   }

//   @Put(':id')
//   @UseGuards(AuthGuard('jwt'))
//   update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() updateDto: UpdateRoomAvailabilityDto,
//   ) {
//     return this.availabilityService.update(id, updateDto);
//   }

//   @Delete(':id')
//   @UseGuards(AuthGuard('jwt'))
//   remove(@Param('id', ParseIntPipe) id: number) {
//     return this.availabilityService.remove(id);
//   }
// }
