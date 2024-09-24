import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite } from './schemas/favorites.schema';
import { MoviesService } from '../movies/movies.service';
import { Movie } from '../movies/interfaces/movie.interface';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<Favorite>,
    private moviesService: MoviesService
  ) {}

  async getFavorites(userId: string): Promise<Movie[]> {
    const favorites = await this.favoriteModel.find({ userId }).exec();
    const allMovies = await this.moviesService.getMovies(1, 100);
    return favorites.map(fav => 
      allMovies.movies.find(movie => movie.id === fav.movieId)
    ).filter(movie => movie !== undefined);
  }

  async addFavorite(movieId: string, userId: string) {
    const existingFavorite = await this.favoriteModel.findOne({ movieId, userId }).exec();
    if (existingFavorite) {
      return { message: 'Movie is already in favorites' };
    }
    const newFavorite = new this.favoriteModel({ movieId, userId });
    await newFavorite.save();
    return { message: 'Added to favorites' };
  }

  async removeFavorite(movieId: string, userId: string) {
    const result = await this.favoriteModel.deleteOne({ movieId, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Favorite not found');
    }
    return { message: 'Removed from favorites' };
  }
}