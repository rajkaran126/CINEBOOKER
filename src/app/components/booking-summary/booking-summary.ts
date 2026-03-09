import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';

import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatChipsModule
  ],
  templateUrl: './booking-summary.html',
  styleUrls: ['./booking-summary.css']
})
export class BookingSummaryComponent implements OnInit {
  pending: Partial<Booking> = {};
  userForm!: FormGroup;
  bookingConfirmed = false;
  confirmedBooking: Booking | null = null;

  constructor(
    private bookingService: BookingService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.pending = this.bookingService.getPendingBooking();

    // Reactive form with validation
    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(2)]],
      userEmail: ['', [Validators.required, Validators.email]],
      userPhone: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]]
    });
  }

  get nameError(): string {
    const ctrl = this.userForm.get('userName');
    if (ctrl?.hasError('required')) return 'Name is required';
    if (ctrl?.hasError('minlength')) return 'Minimum 2 characters';
    return '';
  }

  get emailError(): string {
    const ctrl = this.userForm.get('userEmail');
    if (ctrl?.hasError('required')) return 'Email is required';
    if (ctrl?.hasError('email')) return 'Enter a valid email';
    return '';
  }

  get phoneError(): string {
    const ctrl = this.userForm.get('userPhone');
    if (ctrl?.hasError('required')) return 'Phone is required';
    if (ctrl?.hasError('pattern')) return 'Enter valid 10-digit Indian mobile number';
    return '';
  }

  confirmBooking(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const values = this.userForm.value;
    const booking: Booking = {
      bookingId: this.bookingService.generateBookingId(),
      movieId: this.pending.movieId!,
      movieTitle: this.pending.movieTitle!,
      theatreId: this.pending.theatreId!,
      theatreName: this.pending.theatreName!,
      showtimeId: this.pending.showtimeId!,
      showTime: this.pending.showTime!,
      showDate: this.pending.showDate!,
      seats: this.pending.seats ?? [],
      totalAmount: this.pending.totalAmount!,
      userName: values.userName,
      userEmail: values.userEmail,
      userPhone: values.userPhone,
      bookingDate: new Date().toISOString()
    };
    this.bookingService.confirmBooking(booking);
    this.bookingService.clearPendingBooking();
    this.confirmedBooking = booking;
    this.bookingConfirmed = true;
    this.snackBar.open('🎟️ Booking Confirmed! Enjoy the show!', 'Close', {
      duration: 4000,
      panelClass: ['success-snackbar']
    });
  }

  goToMyBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

  goToMovies(): void {
    this.router.navigate(['/movies']);
  }
}
