import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Booking } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
    // BehaviorSubject to hold bookings state (RxJS Observable pattern)
    private bookingsSubject = new BehaviorSubject<Booking[]>(this.loadFromStorage());
    bookings$: Observable<Booking[]> = this.bookingsSubject.asObservable();

    // Store the current pending booking across navigation
    private pendingBooking: Partial<Booking> = {};

    // ---- Pending booking (for multi-step booking flow) ----
    setPendingBooking(data: Partial<Booking>): void {
        this.pendingBooking = { ...this.pendingBooking, ...data };
    }

    getPendingBooking(): Partial<Booking> {
        return this.pendingBooking;
    }

    clearPendingBooking(): void {
        this.pendingBooking = {};
    }

    // ---- Confirmed bookings ----
    confirmBooking(booking: Booking): void {
        const current = this.bookingsSubject.getValue();
        const updated = [...current, booking];
        this.bookingsSubject.next(updated);
        localStorage.setItem('cinebooker_bookings', JSON.stringify(updated));
    }

    getBookings(): Observable<Booking[]> {
        return this.bookings$;
    }

    generateBookingId(): string {
        return 'BK' + Date.now().toString().slice(-8);
    }

    private loadFromStorage(): Booking[] {
        const data = localStorage.getItem('cinebooker_bookings');
        return data ? JSON.parse(data) : [];
    }
}
