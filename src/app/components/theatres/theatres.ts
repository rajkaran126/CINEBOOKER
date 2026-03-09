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
}
