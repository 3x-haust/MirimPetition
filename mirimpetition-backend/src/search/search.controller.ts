import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SearchPetitionsDto } from './dto/search-petitions.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('petitions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Search petitions' })
  searchPetitions(@Query() query: SearchPetitionsDto) {
    return this.searchService.searchPetitions(query.keyword, {
      status: query.status,
      category: query.category,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get('popular')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get popular petitions' })
  getPopularPetitions() {
    return this.searchService.getPopularPetitions();
  }

  @Get('recent')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get recent petitions' })
  getRecentPetitions() {
    return this.searchService.getRecentPetitions();
  }
} 