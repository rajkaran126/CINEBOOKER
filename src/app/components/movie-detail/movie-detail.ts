import { Component } from '@angular/core';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.html'
})
export class MovieDetailComponent {

  movie = {
    title: 'Interstellar',
    cast: 'Matthew McConaughey',
    duration: 169,
    rating: 4.7
  };
}
