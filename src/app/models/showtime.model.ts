// TypeScript interface and data types to define the structure of a Showtime object
export interface Showtime {
  id: number;
  movieId: number;
  theatreId: number;
  date: string;       // ISO date string
  showTime: string;   // "10:00 AM"
  ticketPrice: number;
  totalSeats: number;
  availableSeats: number;
  isSoldOut: boolean;
}