import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('q') query: string, @Query('limit') limit?: string) {
    if (!query) {
      return { results: [] };
    }

    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.searchService.searchProperties(query, limitNum);
  }
}

