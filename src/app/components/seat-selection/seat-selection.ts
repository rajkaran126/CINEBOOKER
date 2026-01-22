import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './seat-selection.html',
  styleUrls: ['./seat-selection.css']
})
export class SeatSelectionComponent {
  seats = [
    { number: 'A1', isBooked: false },
    { number: 'A2', isBooked: true },
    { number: 'A3', isBooked: false },
    { number: 'A4', isBooked: false }
  ];

  selectSeat(seat: any) {
    if (!seat.isBooked) {
      seat.isBooked = true;
    }
  }
}
