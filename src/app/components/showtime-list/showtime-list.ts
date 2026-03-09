import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ShowtimeService } from '../../services/showtime.service';
import { TheatreService } from '../../services/theatre.service';
import { MovieService } from '../../services/movie.service';
import { BookingService } from '../../services/booking.service';
import { Showtime } from '../../models/showtime.model';
import { Theatre } from '../../models/theatre.model';
import { Movie } from '../../models/movie.model';
import { SoldOutDirective } from '../../directives/sold-out.directive';
import { PremiumTheatreDirective } from '../../directives/premium-theatre.directive';

interface ShowtimeRow extends Showtime {
  theatreName: string;
  theatreLocation: string;
  isPremium: boolean;
}

@Component({
  selector: 'app-showtime-list',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CurrencyPipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    SoldOutDirective,
    PremiumTheatreDirective
  ],
  templateUrl: './showtime-list.html',
  styleUrls: ['./showtime-list.css']
})
export class ShowtimeListComponent implements OnInit {
  movie: Movie | undefined;
  showtimeRows: ShowtimeRow[] = [];
  loading = true;
  displayedColumns = ['theatre', 'showTime', 'price', 'available', 'action'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private showtimeService: ShowtimeService,
    private theatreService: TheatreService,
    private movieService: MovieService,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    const movieId = Number(this.route.snapshot.paramMap.get('movieId'));

    // Fetch movie details
    this.movieService.getMovieById(movieId).subscribe(m => this.movie = m);

    // Fetch showtimes + theatres and merge
    this.showtimeService.getShowtimesByMovieId(movieId).subscribe(showtimes => {
      this.theatreService.getTheatres().subscribe(theatres => {
        this.showtimeRows = showtimes.map(s => {
          const t = theatres.find(th => th.id === s.theatreId);
          return {
            ...s,
            theatreName: t?.name ?? 'Unknown Theatre',
            theatreLocation: t?.location ?? '',
            isPremium: t?.isPremium ?? false
          };
        });
        this.loading = false;
      });
    });
  }

  bookSeats(showtime: ShowtimeRow): void {
    // Store pending booking context
    this.bookingService.setPendingBooking({
      movieId: this.movie?.id,
      movieTitle: this.movie?.title,
      theatreId: showtime.theatreId,
      theatreName: showtime.theatreName,
      showtimeId: showtime.id,
      showTime: showtime.showTime,
      showDate: showtime.date,
      totalAmount: 0
    });
    this.router.navigate(['/seats', showtime.id]);
  }

  goBack(): void {
    this.router.navigate(['/movie', this.movie?.id]);
  }
}
