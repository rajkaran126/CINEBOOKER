// TypeScript interface and data types to define the structure of a Theatre object
export interface Theatre {
  id: number;
  name: string;
  location: string;
  screens: number;
  amenities: string[];
  isPremium: boolean;
}