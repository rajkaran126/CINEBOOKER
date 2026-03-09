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
}
