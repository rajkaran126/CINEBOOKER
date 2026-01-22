//uses interface and data types to define the structure of a Movie object

export interface Movie{
  id: number;
  title: string;
  genre: string;
  language: string;
  duration: number;   // in minutes
  rating: number;
}
