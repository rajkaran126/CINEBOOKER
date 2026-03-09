import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Movie } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class MovieService {
    private dataUrl = 'assets/data/movies.json';

    constructor(private http: HttpClient) { }

    // Fetch all movies via HttpClient (RxJS Observable)
    getMovies(): Observable<Movie[]> {
        return this.http.get<Movie[]>(this.dataUrl).pipe(
            catchError(() => of([]))
        );
    }

    // Get a single movie by id using RxJS map operator
    getMovieById(id: number): Observable<Movie | undefined> {
        return this.getMovies().pipe(
            map(movies => movies.find(m => m.id === id))
        );
    }

    // Filter movies by genre using RxJS
    getMoviesByGenre(genre: string): Observable<Movie[]> {
        return this.getMovies().pipe(
            map(movies => genre ? movies.filter(m => m.genre.toLowerCase() === genre.toLowerCase()) : movies)
        );
    }

    // Get distinct genres
    getGenres(): Observable<string[]> {
        return this.getMovies().pipe(
            map(movies => [...new Set(movies.map(m => m.genre))])
        );
    }

    // Get distinct languages
    getLanguages(): Observable<string[]> {
        return this.getMovies().pipe(
            map(movies => [...new Set(movies.map(m => m.language))])
        );
    }
}
