import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './booking-summary.html'
})
export class BookingSummaryComponent {}
