import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Showtime } from '../models/showtime.model';

@Injectable({ providedIn: 'root' })
export class ShowtimeService {
    private dataUrl = 'assets/data/showtimes.json';

    constructor(private http: HttpClient) { }

    // Fetch all showtimes via HttpClient
    getShowtimes(): Observable<Showtime[]> {
        return this.http.get<Showtime[]>(this.dataUrl).pipe(
            catchError(() => of([]))
        );
    }

    // Get showtimes for a specific movie (RxJS filter via map)
    getShowtimesByMovieId(movieId: number): Observable<Showtime[]> {
        return this.getShowtimes().pipe(
            map(showtimes => showtimes.filter(s => s.movieId === movieId))
        );
    }

    // Get a single showtime by id
    getShowtimeById(id: number): Observable<Showtime | undefined> {
        return this.getShowtimes().pipe(
            map(showtimes => showtimes.find(s => s.id === id))
        );
    }
}
