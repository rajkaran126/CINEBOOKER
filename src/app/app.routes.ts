import { Routes } from '@angular/router';
import { MovieListComponent } from './components/movie-list/movie-list';
import { MovieDetailComponent } from './components/movie-detail/movie-detail';
import { ShowtimeListComponent } from './components/showtime-list/showtime-list';
import { SeatSelectionComponent } from './components/seat-selection/seat-selection';
import { BookingSummaryComponent } from './components/booking-summary/booking-summary';
import { MyBookingsComponent } from './components/my-bookings/my-bookings';
import { TheatresComponent } from './components/theatres/theatres';
import { bookingGuard } from './guards/booking.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' },
  { path: 'movies', component: MovieListComponent },
  { path: 'movie/:id', component: MovieDetailComponent },
  { path: 'showtimes/:movieId', component: ShowtimeListComponent },
  { path: 'seats/:showtimeId', component: SeatSelectionComponent },
  { path: 'booking-summary', component: BookingSummaryComponent, canActivate: [bookingGuard] },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'theatres', component: TheatresComponent },
  { path: '**', redirectTo: 'movies' }
];
