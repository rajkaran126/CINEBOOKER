#  CINEBOOKER

Cinebooker is a modern, responsive Angular application for browsing movies, selecting theatres, choosing showtimes, and booking seats. 

##  Features

- **3D Neon UI**: A complete visual overhaul featuring a futuristic dark moden, cyan/violet neon glows, and glassmorphism cards.
- **Interactive 3D Background**: A site-wide 3D particle network animation that responds to mouse movement, giving a highly dynamic and cinematic feel.
- **Dynamic 3D Hover Effects**: Movie and theatre cards physically tilt in 3D-space based on cursor position.
- **Movie Booking Flow**: Seamless journey from selecting a movie to confirming seats.
- **Dynamic Theatres & Showtimes**: Integrated data for multiple theatres.
- **Interactive Seat Selection**: Visually choose your preferred seats in a neon-themed theatre layout.

##  Tech Stack

- **Framework**: [Angular](https://github.com/angular/angular-cli) (version 17+)
- **Styling**: Custom CSS with advanced 3D transforms (`preserve-3d`, `perspective`), glassmorphism, and CSS variables.
- **Animation**: Pure HTML5 Canvas 3D particle rendering without external libraries.
- **Testing**: [Vitest](https://vitest.dev/) for unit testing

##  Local Development

To run this project locally, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajkaran126/CINEBOOKER.git
   cd CINEBOOKER
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

##  Building for Production

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

##  Testing

To execute the unit tests via Vitest, run:
```bash
ng test
```

##  License

This project is licensed under the MIT License.
