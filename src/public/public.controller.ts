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

  @Get('agents/:agentId/reviews')
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

  @Get('categories/:id/services')
  getServicesByCategory(@Param('id', ParseIntPipe) categoryId: number) {
    return this.publicService.getServicesByCategory(categoryId);
  }

  @Get('featured/services')
  getFeaturedServices() {
    return this.publicService.getFeaturedServices();
  }

  @Get('featured/agents')
  getFeaturedAgents() {
    return this.publicService.getFeaturedAgents();
  }

  @Get('trending/services')
  getTrendingServices() {
    return this.publicService.getTrendingServices();
  }

  @Get('services/:id/related')
  getRelatedServices(@Param('id', ParseIntPipe) serviceId: number) {
    return this.publicService.getRelatedServices(serviceId);
  }

  @Get('services/:id/reviews')
  getServiceReviews(@Param('id', ParseIntPipe) serviceId: number) {
    return this.publicService.getServiceReviews(serviceId);
  }

  @Get('top/agents')
  getTopRatedAgents(@Query('limit') limit: number = 10) {
    return this.publicService.getTopRatedAgents(limit);
  }

  @Get('platform/stats')
  getPlatformStats() {
    return this.publicService.getPlatformStats();
  }
}
