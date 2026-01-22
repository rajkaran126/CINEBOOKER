import { Component } from '@angular/core';
import { NgForOf } from "../../../../node_modules/@angular/common/types/_common_module-chunk";

@Component({
  selector: 'app-showtime-list',
  templateUrl: './showtime-list.html',
  imports: [NgForOf]
})
export class ShowtimeListComponent {

  showtimes = ['10:00 AM', '2:00 PM', '6:00 PM'];
}
