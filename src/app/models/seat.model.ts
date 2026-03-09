// TypeScript interface and data types to define the structure of a Seat object
export type SeatStatus = 'available' | 'booked' | 'selected';
export type SeatType = 'standard' | 'premium' | 'vip';

export interface Seat {
    id: string;         // e.g., "A1"
    row: string;        // e.g., "A"
    number: number;     // e.g., 1
    status: SeatStatus;
    type: SeatType;
    price: number;
}
