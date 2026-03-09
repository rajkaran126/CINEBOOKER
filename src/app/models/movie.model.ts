// TypeScript interface using data types to define the structure of a Movie object
export interface Movie {
  id: number;
  title: string;
  genre: string;
  language: string;
  duration: number;   // in minutes
  rating: number;
  description: string;
  cast: string[];
  poster: string;
  releaseDate: string;
  isNowShowing: boolean;
}

// BaseEntity class demonstrating TypeScript class inheritance
export abstract class BaseEntity {
  constructor(public id: number, public createdAt: string = new Date().toISOString()) {}
}

// MovieEntity class extending BaseEntity (demonstrates inheritance)
export class MovieEntity extends BaseEntity implements Movie {
  title: string;
  genre: string;
  language: string;
  duration: number;
  rating: number;
  description: string;
  cast: string[];
  poster: string;
  releaseDate: string;
  isNowShowing: boolean;

  constructor(data: Movie) {
    super(data.id);
    this.title = data.title;
    this.genre = data.genre;
    this.language = data.language;
    this.duration = data.duration;
    this.rating = data.rating;
    this.description = data.description;
    this.cast = data.cast;
    this.poster = data.poster;
    this.releaseDate = data.releaseDate;
    this.isNowShowing = data.isNowShowing;
  }
}
