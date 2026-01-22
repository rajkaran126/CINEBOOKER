import { Person } from './person.model';

export class User extends Person {
  userId!: number;
  phone!: string;
}
//inherits properties of Person class to define the structure of a User object