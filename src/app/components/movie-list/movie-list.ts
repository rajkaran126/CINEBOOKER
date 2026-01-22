import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './movie-list.html',
  styleUrls: ['./movie-list.css']
})
export class MovieListComponent {

  movies = [
    {
      title: 'Interstellar',
      genre: 'Sci-Fi',
      language: 'English',
      rating: 4.7,
      poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSngBJ0B7UDrLUkDlp6DCQLsEYuWR-DiHwbnxFFCniB3HiP3f3NZmR1-lKSC34ge6YXu4LX&s=10'
    },
    {
      title: 'KGF Chapter 2',
      genre: 'Action',
      language: 'Kannada',
      rating: 4.6,
      poster: 'https://www.bollywoodhungama.com/wp-content/uploads/2022/04/620x450-2.jpg'
    }
  ];
}
