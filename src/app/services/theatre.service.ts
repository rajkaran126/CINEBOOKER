import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Theatre } from '../models/theatre.model';

@Injectable({ providedIn: 'root' })
export class TheatreService {
    private dataUrl = 'assets/data/theatres.json';

    constructor(private http: HttpClient) { }

    // Fetch all theatres via HttpClient
    getTheatres(): Observable<Theatre[]> {
        return this.http.get<Theatre[]>(this.dataUrl).pipe(
            catchError(() => of([]))
        );
    }

    // Get a single theatre by id
    getTheatreById(id: number): Observable<Theatre | undefined> {
        return this.getTheatres().pipe(
            map(theatres => theatres.find(t => t.id === id))
        );
    }
}
