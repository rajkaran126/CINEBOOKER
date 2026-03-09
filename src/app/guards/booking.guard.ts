import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BookingService } from '../services/booking.service';

// Route guard to protect booking-confirmation – requires a pending booking
export const bookingGuard: CanActivateFn = () => {
    const bookingService = inject(BookingService);
    const router = inject(Router);
    const pending = bookingService.getPendingBooking();

    if (pending && pending.showtimeId) {
        return true;
    }
    // Redirect to movies list if no booking in progress
    return router.createUrlTree(['/movies']);
};
