import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get()
  async getMovies(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.moviesService.getMovies(page, limit);
  }
}