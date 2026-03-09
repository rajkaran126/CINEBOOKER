import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TheatreService } from '../../services/theatre.service';
import { Theatre } from '../../models/theatre.model';
import { PremiumTheatreDirective } from '../../directives/premium-theatre.directive';

@Component({
    selector: 'app-theatres',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        PremiumTheatreDirective
    ],
    templateUrl: './theatres.html',
    styleUrls: ['./theatres.css']
})
export class TheatresComponent implements OnInit {
    theatres: Theatre[] = [];
    loading = true;

    constructor(private theatreService: TheatreService, private router: Router) { }

    ngOnInit(): void {
        this.theatreService.getTheatres().subscribe({
            next: (theatres) => {
                this.theatres = theatres;
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }

    goToMovies(): void {
        this.router.navigate(['/movies']);
    }

    onCardMouseMove(e: MouseEvent): void {
        const wrapper = e.currentTarget as HTMLElement;
        const card = wrapper.querySelector('.theatre-card') as HTMLElement | null;
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
        const card = (e.currentTarget as HTMLElement).querySelector('.theatre-card') as HTMLElement | null;
        if (!card) return;
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
        card.classList.remove('is-hovered');
    }
}
