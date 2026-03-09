import { Pipe, PipeTransform } from '@angular/core';
import { Movie } from '../models/movie.model';

// Custom pipe to filter movies by genre, language, or minimum rating
@Pipe({
    name: 'filterMovies',
    standalone: true
})
export class FilterMoviesPipe implements PipeTransform {
    transform(movies: Movie[], genre?: string, language?: string, minRating?: number): Movie[] {
        let filtered = [...movies];

        if (genre && genre !== 'All') {
            filtered = filtered.filter(m => m.genre.toLowerCase() === genre.toLowerCase());
        }
        if (language && language !== 'All') {
            filtered = filtered.filter(m => m.language.toLowerCase() === language.toLowerCase());
        }
        if (minRating && minRating > 0) {
            filtered = filtered.filter(m => m.rating >= minRating);
        }
        return filtered;
    }
}
