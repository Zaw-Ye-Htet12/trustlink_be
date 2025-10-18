import {
  Controller,
  UseGuards,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AddServiceImageDto } from './dto/add-service-image.dto';
import { AddServiceTagsDto } from './dto/add-service-tags.dto';

@Controller('agent/services')
@UseGuards(AuthGuard('jwt'))
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateServiceDto) {
    const user = req.user as { sub: number };
    return this.serviceService.create(user.sub, dto);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as { sub: number };
    return this.serviceService.findAllByAgent(user.sub);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const user = req.user as { sub: number };
    return this.serviceService.findOneByAgent(user.sub, id);
  }

  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServiceDto,
  ) {
    const user = req.user as { sub: number };
    return this.serviceService.update(user.sub, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const user = req.user as { sub: number };
    return this.serviceService.remove(user.sub, id);
  }

  @Post(':id/images')
  addImage(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddServiceImageDto,
  ) {
    const user = req.user as { sub: number };
    return this.serviceService.addImages(user.sub, id, dto);
  }

  @Get(':id/images')
  getImages(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const user = req.user as { sub: number };
    return this.serviceService.getImages(user.sub, id);
  }

  @Post(':id/tags')
  addTags(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddServiceTagsDto,
  ) {
    const user = req.user as { sub: number };
    return this.serviceService.addTags(user.sub, id, dto);
  }

  @Get(':id/tags')
  getTags(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const user = req.user as { sub: number };
    return this.serviceService.getTags(user.sub, id);
  }
}
