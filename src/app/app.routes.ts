import { Routes } from '@angular/router';
import { MovieListComponent } from './components/movie-list/movie-list';
import { BookingSummaryComponent } from './components/booking-summary/booking-summary';

export const routes: Routes = [
  { path: '', component: MovieListComponent },
  { path: 'booking-summary', component: BookingSummaryComponent }
];
