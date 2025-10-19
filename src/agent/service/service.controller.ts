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

interface AuthRequest extends Request {
  user: { sub: number };
}

@Controller('agent/services')
@UseGuards(AuthGuard('jwt'))
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  /** ✅ Get all services for the logged-in agent */
  @Get()
  findAll(@Req() req: AuthRequest) {
    const userId = req.user.sub;
    return this.serviceService.findAllByAgent(userId);
  }

  /** Create a new service */
  @Post()
  create(@Req() req: AuthRequest, @Body() dto: CreateServiceDto) {
    const userId = req.user.sub;
    return this.serviceService.create(userId, dto);
  }

  /** Add images to a service */
  @Post(':id/images')
  addImage(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddServiceImageDto,
  ) {
    const userId = req.user.sub;
    return this.serviceService.addImages(userId, id, dto);
  }

  /** Get images for a service */
  @Get(':id/images')
  getImages(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.sub;
    return this.serviceService.getImages(userId, id);
  }

  /** Add tags to a service */
  @Post(':id/tags')
  addTags(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddServiceTagsDto,
  ) {
    const userId = req.user.sub;
    return this.serviceService.addTags(userId, id, dto);
  }

  /** Get tags for a service */
  @Get(':id/tags')
  getTags(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.sub;
    return this.serviceService.getTags(userId, id);
  }

  /** Get one service by ID */
  @Get(':id')
  findOne(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.sub;
    return this.serviceService.findOneByAgent(userId, id);
  }

  /** Update a service */
  @Patch(':id')
  update(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServiceDto,
  ) {
    const userId = req.user.sub;
    return this.serviceService.update(userId, id, dto);
  }

  /** Delete a service */
  @Delete(':id')
  remove(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.sub;
    return this.serviceService.remove(userId, id);
  }
}
