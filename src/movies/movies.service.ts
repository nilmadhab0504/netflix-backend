import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Movie } from './interfaces/movie.interface';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async getMovies(page: number = 1, limit: number = 20): Promise<{ movies: Movie[], total: number, page: number, limit: number }> {
    if (this.movies.length === 0) {
      await this.fetchMovies();
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedMovies = this.movies.slice(startIndex, endIndex);

    return {
      movies: paginatedMovies,
      total: this.movies.length,
      page,
      limit,
    };
  }

  private async fetchMovies(): Promise<void> {
    const rapidApiKey = this.configService.get<string>('RAPID_API_KEY');
    const rapidApiHost = 'imdb-top-100-movies.p.rapidapi.com';

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<Movie[]>('https://imdb-top-100-movies.p.rapidapi.com/', {
          headers: {
            'x-rapidapi-host': rapidApiHost,
            'x-rapidapi-key': rapidApiKey,
          },
        }).pipe(
          catchError((error: AxiosError) => {
            console.error(error.response.data);
            throw new HttpException('An error occurred while fetching movies', HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );

      this.movies = data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw new HttpException('Failed to fetch movies', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}