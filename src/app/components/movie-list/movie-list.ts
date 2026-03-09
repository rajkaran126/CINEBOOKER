import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatSelectModule, MatFormFieldModule, MatInputModule,
    MatChipsModule, MatProgressSpinnerModule
  ],
  templateUrl: './movie-list.html',
  styleUrls: ['./movie-list.css']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  genres: string[] = ['All'];
  languages: string[] = ['All'];
  loading = true;

  selectedGenre    = 'All';
  selectedLanguage = 'All';
  minRating = 0;
  searchTerm = '';

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.movieService.getMovies().subscribe({
      next: movies => {
        this.movies = movies;
        this.genres    = ['All', ...new Set(movies.map(m => m.genre))];
        this.languages = ['All', ...new Set(movies.map(m => m.language))];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  // ── 3D card tilt driven by CSS custom properties ──────────────────────────
  onCardMouseMove(e: MouseEvent): void {
    const wrapper = e.currentTarget as HTMLElement;
    const card = wrapper.querySelector('.movie-card') as HTMLElement | null;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
    const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    card.style.setProperty('--rx', `${dy * -10}deg`);
    card.style.setProperty('--ry', `${dx *  10}deg`);
    card.style.setProperty('--hx', `${((e.clientX - rect.left) / rect.width  * 100).toFixed(1)}%`);
    card.style.setProperty('--hy', `${((e.clientY - rect.top)  / rect.height * 100).toFixed(1)}%`);
    card.classList.add('is-hovered');
  }

  onCardMouseLeave(e: MouseEvent): void {
    const card = (e.currentTarget as HTMLElement).querySelector('.movie-card') as HTMLElement | null;
    if (!card) return;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    card.classList.remove('is-hovered');
  }

  viewDetail(id: number): void    { this.router.navigate(['/movie', id]); }
  viewShowtimes(id: number): void { this.router.navigate(['/showtimes', id]); }

  getCardClass(genre: string): string {
    return genre.toLowerCase().replace(/\s/g, '-');
  }

  get filteredMovies(): Movie[] {
    return this.movies.filter(m => {
      const matchGenre  = this.selectedGenre   === 'All' || m.genre    === this.selectedGenre;
      const matchLang   = this.selectedLanguage === 'All' || m.language === this.selectedLanguage;
      const matchRating = m.rating >= this.minRating;
      const matchSearch = !this.searchTerm || m.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchGenre && matchLang && matchRating && matchSearch;
    });
  }
}
