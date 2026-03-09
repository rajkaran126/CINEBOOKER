import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-my-bookings',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatChipsModule,
        MatDividerModule
    ],
    templateUrl: './my-bookings.html',
    styleUrls: ['./my-bookings.css']
})
export class MyBookingsComponent implements OnInit {
    bookings$!: Observable<Booking[]>;

    constructor(private bookingService: BookingService, private router: Router) { }

    ngOnInit(): void {
        this.bookings$ = this.bookingService.getBookings();
    }

    browseMovies(): void {
        this.router.navigate(['/movies']);
    }

    onCardMouseMove(e: MouseEvent): void {
        const wrapper = e.currentTarget as HTMLElement;
        const card = wrapper.querySelector('.booking-card') as HTMLElement | null;
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
        const card = (e.currentTarget as HTMLElement).querySelector('.booking-card') as HTMLElement | null;
        if (!card) return;
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
        card.classList.remove('is-hovered');
    }
}
