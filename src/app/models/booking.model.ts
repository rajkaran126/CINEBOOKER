// TypeScript interface and data types to define the structure of a Booking object
export interface Booking {
  bookingId: string;
  movieId: number;
  movieTitle: string;
  theatreId: number;
  theatreName: string;
  showtimeId: number;
  showTime: string;
  showDate: string;
  seats: string[];
  totalAmount: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  bookingDate: string;
}