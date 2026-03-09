import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ShowtimeService } from '../../services/showtime.service';
import { BookingService } from '../../services/booking.service';
import { Showtime } from '../../models/showtime.model';
import { Seat, SeatStatus, SeatType } from '../../models/seat.model';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './seat-selection.html',
  styleUrls: ['./seat-selection.css']
})
export class SeatSelectionComponent implements OnInit {
  showtime: Showtime | undefined;
  seats: Seat[] = [];
  selectedSeats: Seat[] = [];
  loading = true;

  // Seat grid config
  rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  seatsPerRow = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private showtimeService: ShowtimeService,
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const showtimeId = Number(this.route.snapshot.paramMap.get('showtimeId'));
    this.showtimeService.getShowtimeById(showtimeId).subscribe(st => {
      this.showtime = st;
      this.generateSeats();
      this.loading = false;
    });
  }

  generateSeats(): void {
    // Demonstrate [ngStyle] and [ngClass] usage in template
    const bookedCount = this.showtime ? (this.showtime.totalSeats - this.showtime.availableSeats) : 10;
    let seatIndex = 0;
    this.seats = [];

    for (const row of this.rows) {
      for (let i = 1; i <= this.seatsPerRow; i++) {
        const type: SeatType = row <= 'B' ? 'vip' : row <= 'D' ? 'premium' : 'standard';
        const basePrice = this.showtime?.ticketPrice ?? 200;
        const price = type === 'vip' ? basePrice * 1.5 : type === 'premium' ? basePrice * 1.25 : basePrice;
        const status: SeatStatus = seatIndex < bookedCount ? 'booked' : 'available';
        this.seats.push({ id: `${row}${i}`, row, number: i, status, type, price });
        seatIndex++;
      }
    }
  }

  getRowSeats(row: string): Seat[] {
    return this.seats.filter(s => s.row === row);
  }

  toggleSeat(seat: Seat): void {
    if (seat.status === 'booked') return;
    if (seat.status === 'selected') {
      seat.status = 'available';
      this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
    } else {
      if (this.selectedSeats.length >= 8) {
        this.snackBar.open('Maximum 8 seats per booking', 'Close', { duration: 2000 });
        return;
      }
      seat.status = 'selected';
      this.selectedSeats.push(seat);
    }
  }

  getTotalAmount(): number {
    return this.selectedSeats.reduce((sum, s) => sum + s.price, 0);
  }

  proceedToBooking(): void {
    if (this.selectedSeats.length === 0) {
      this.snackBar.open('Please select at least one seat', 'Close', { duration: 2000 });
      return;
    }
    this.bookingService.setPendingBooking({
      seats: this.selectedSeats.map(s => s.id),
      totalAmount: this.getTotalAmount()
    });
    this.router.navigate(['/booking-summary']);
  }

  goBack(): void {
    this.router.navigate(['/showtimes', this.showtime?.movieId]);
  }
}
