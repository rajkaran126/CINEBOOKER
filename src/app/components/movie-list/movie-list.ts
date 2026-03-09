import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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

interface Star { x: number; y: number; r: number; alpha: number; dir: number; vx: number; vy: number; }
interface Shoot { x: number; y: number; vx: number; vy: number; len: number; life: number; }

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
export class MovieListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cosmicCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  movies: Movie[] = [];
  genres: string[] = ['All'];
  languages: string[] = ['All'];
  loading = true;

  selectedGenre = 'All';
  selectedLanguage = 'All';
  minRating = 0;
  searchTerm = '';

  private ctx!: CanvasRenderingContext2D;
  private animId = 0;
  private stars: Star[] = [];
  private shoots: Shoot[] = [];
  private mouse = { x: 0, y: 0 };
  private orb = { x: 0, y: 0 };  // smooth lerp target
  private t = 0;

  constructor(private movieService: MovieService, private router: Router) { }

  ngOnInit(): void {
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.genres = ['All', ...new Set(movies.map(m => m.genre))];
        this.languages = ['All', ...new Set(movies.map(m => m.language))];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  ngAfterViewInit(): void { setTimeout(() => this.initCanvas(), 60); }
  ngOnDestroy(): void { cancelAnimationFrame(this.animId); }

  // Called from template (mousemove on hero-section)
  onMouseMove(e: MouseEvent): void {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  // ── Canvas setup ──────────────────────────────────────────────────────────
  private initCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    this.ctx = canvas.getContext('2d')!;
    this.orb = { x: canvas.width / 2, y: canvas.height / 2 };
    this.mouse = { ...this.orb };
    this.buildStars(canvas.width, canvas.height);
    this.scheduleShoot(canvas.width, canvas.height);
    this.animate();
  }

  // ── 180 white stars ───────────────────────────────────────────────────────
  private buildStars(W: number, H: number): void {
    this.stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.2,
      alpha: Math.random() * 0.6 + 0.4,
      dir: Math.random() > 0.5 ? 1 : -1,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    }));
  }

  // ── Shooting stars ────────────────────────────────────────────────────────
  private scheduleShoot(W: number, H: number): void {
    setTimeout(() => {
      const angle = (15 + Math.random() * 35) * Math.PI / 180;
      const spd = 10 + Math.random() * 10;
      this.shoots.push({
        x: Math.random() * W * 0.85,
        y: Math.random() * H * 0.6,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        len: 70 + Math.random() * 90,
        life: 1
      });
      this.scheduleShoot(W, H);
    }, 600 + Math.random() * 2000);
  }

  // ── Galaxy spiral ─────────────────────────────────────────────────────────
  private drawGalaxy(W: number, H: number): void {
    const ctx = this.ctx;
    const cx = W * 0.72, cy = H * 0.30;

    // Outer nebula glow
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 220);
    g.addColorStop(0, 'rgba(160,100,255,0.22)');
    g.addColorStop(0.4, 'rgba(80,50,180,0.10)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Two spiral arms
    ctx.save();
    for (let arm = 0; arm < 2; arm++) {
      const offset = arm * Math.PI;
      for (let i = 0; i < 80; i++) {
        const frac = i / 80;
        const r = 18 + frac * 180;
        const th = frac * Math.PI * 4 + offset + this.t * 0.08;
        const spread = (1 - frac) * 16;
        const px = cx + r * Math.cos(th) + (Math.random() - 0.5) * spread;
        const py = cy + r * Math.sin(th) * 0.44 + (Math.random() - 0.5) * spread;
        ctx.beginPath();
        ctx.arc(px, py, (1 - frac) * 2 + 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${(1 - frac) * 0.55 + 0.05})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(200,150,255,0.5)';
        ctx.fill();
      }
    }
    ctx.restore();

    // Core
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 34);
    core.addColorStop(0, 'rgba(255,255,255,0.95)');
    core.addColorStop(0.3, 'rgba(220,170,255,0.6)');
    core.addColorStop(1, 'transparent');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, 34, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Animation loop ────────────────────────────────────────────────────────
  private animate(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = this.ctx;
    const W = canvas.width, H = canvas.height;
    this.t += 0.012;

    // Lerp orb toward mouse
    this.orb.x += (this.mouse.x - this.orb.x) * 0.055;
    this.orb.y += (this.mouse.y - this.orb.y) * 0.055;

    // Dark space fill
    ctx.fillStyle = '#050512';
    ctx.fillRect(0, 0, W, H);

    // Galaxy
    this.drawGalaxy(W, H);

    // Mouse orb glow
    const g1 = ctx.createRadialGradient(this.orb.x, this.orb.y, 0, this.orb.x, this.orb.y, 230);
    g1.addColorStop(0, 'rgba(233,69,96,0.18)');
    g1.addColorStop(0.5, 'rgba(159,122,234,0.08)');
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);

    const g2 = ctx.createRadialGradient(this.orb.x, this.orb.y, 0, this.orb.x, this.orb.y, 72);
    g2.addColorStop(0, 'rgba(233,69,96,0.32)');
    g2.addColorStop(0.6, 'rgba(159,122,234,0.12)');
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H);

    // White stars
    this.stars.forEach(s => {
      s.x += s.vx; s.y += s.vy;
      if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
      s.alpha += s.dir * 0.006;
      if (s.alpha > 1) { s.alpha = 1; s.dir = -1; }
      if (s.alpha < 0.15) { s.alpha = 0.15; s.dir = 1; }
      const dist = Math.hypot(s.x - this.orb.x, s.y - this.orb.y);
      const glow = dist < 110 ? 1 + (110 - dist) / 110 * 1.4 : 1;
      ctx.save();
      ctx.globalAlpha = Math.min(s.alpha * glow, 1);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = s.r * 4 * glow;
      ctx.shadowColor = 'rgba(255,255,255,0.8)';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * glow, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Shooting stars
    this.shoots = this.shoots.filter(s => s.life > 0);
    this.shoots.forEach(s => {
      s.life -= 0.020;
      ctx.save();
      ctx.globalAlpha = s.life;
      const tail = ctx.createLinearGradient(
        s.x - s.vx * (s.len / 12), s.y - s.vy * (s.len / 12), s.x, s.y
      );
      tail.addColorStop(0, 'transparent');
      tail.addColorStop(1, '#ffffff');
      ctx.strokeStyle = tail;
      ctx.lineWidth = 1.8;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(s.x - s.vx * (s.len / 12), s.y - s.vy * (s.len / 12));
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
      ctx.restore();
      s.x += s.vx; s.y += s.vy;
    });

    this.animId = requestAnimationFrame(() => this.animate());
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  viewDetail(id: number): void { this.router.navigate(['/movie', id]); }
  viewShowtimes(id: number): void { this.router.navigate(['/showtimes', id]); }

  getCardClass(genre: string): string {
    return genre.toLowerCase().replace(/\s/g, '-');
  }

  get filteredMovies(): Movie[] {
    return this.movies.filter(m => {
      const matchGenre = this.selectedGenre === 'All' || m.genre === this.selectedGenre;
      const matchLang = this.selectedLanguage === 'All' || m.language === this.selectedLanguage;
      const matchRating = m.rating >= this.minRating;
      const matchSearch = !this.searchTerm || m.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchGenre && matchLang && matchRating && matchSearch;
    });
  }
}
