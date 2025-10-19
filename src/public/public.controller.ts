import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PublicService } from './public.service';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('search/agents')
  searchAgents(
    @Query('keyword') keyword?: string,
    @Query('location') location?: string,
  ) {
    return this.publicService.searchAgents(keyword, location);
  }

  @Get('search/services')
  searchServices(
    @Query('categoryIds') categoryIds?: string,
    @Query('keyword') keyword?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('location') location?: string,
    @Query('tags') tags?: string,
    @Query('verifiedOnly') verifiedOnly?: boolean,
    @Query('minRating') minRating?: number,
  ) {
    const categoryList =
      categoryIds
        ?.split(',')
        .map((id) => Number(id.trim()))
        .filter(Boolean) ?? [];

    return this.publicService.searchServicesAdvanced({
      categoryIds: categoryList,
      keyword,
      minPrice,
      maxPrice,
      location,
      tags: tags?.split(',').map((t) => t.trim()) ?? [],
      verifiedOnly,
      minRating,
    });
  }

  @Get('search/filter')
  filterAgents(
    @Query('minRating') minRating?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('status') status?: VerificationStatus,
  ) {
    return this.publicService.filterAgentsByStats({
      minRating,
      maxPrice,
      status,
    });
  }

  @Get('reviews/:agentId')
  getAgentReviews(@Param('agentId', ParseIntPipe) agentId: number) {
    return this.publicService.getReviewsForAgent(agentId);
  }

  // ===== PUBLIC CATEGORY + TAG FETCH =====
  @Get('categories')
  getCategories() {
    return this.publicService.getAllCategories();
  }

  @Get('tags')
  getTags() {
    return this.publicService.getAllTags();
  }

  @Get('agents/:id')
  getAgentById(@Param('id', ParseIntPipe) id: number) {
    return this.publicService.getAgentById(id);
  }

  @Get('services/:id')
  getServiceById(@Param('id', ParseIntPipe) id: number) {
    return this.publicService.getServiceById(id);
  }

  @Get('services')
  getAllServices() {
    return this.publicService.getAllServices();
  }
}
