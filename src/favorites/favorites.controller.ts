import { Controller, Get, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  async getFavorites(@Req() req) {
    return this.favoritesService.getFavorites(req.user.userId);
  }

  @Post(':movieId')
  async addFavorite(@Param('movieId') movieId: string, @Req() req) {
    return this.favoritesService.addFavorite(movieId, req.user.userId);
  }

  @Delete(':movieId')
  async removeFavorite(@Param('movieId') movieId: string, @Req() req) {
    return this.favoritesService.removeFavorite(movieId, req.user.userId);
  }
}
