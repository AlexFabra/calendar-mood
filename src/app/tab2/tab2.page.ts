import { Component } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import './tab2.page.css';

import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['./tab2.page.css']
})
export class Tab2Page {

  selectedDate: string;
  selected: Date = new Date();

  constructor(date: DateAdapter<Date>) {
    //canvia el dia d'inici de la setmana a dilluns:
    date.getFirstDayOfWeek = () => 1;
  }

  /** Assignar classes segons el dia.
   *
   * @param cellDate element el valor del qual és la data.
   * @param view 'month' || 'year'
   * @returns nom de la classe que se li aplicarà al dia seleccionat.
   */
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {

    let style: string = '';
    // Només és si la vista del mes:
    if (view === 'month') {
      //nombre del dia del mes:
      const date: number = cellDate.getDate();
      //nombre del dia de la setmana:
      const dayOfWeek: number = cellDate.getDay();
      //segons el dia de la setmana li donem un estil o un altre
      if (dayOfWeek === 0) {
        style = 'diumenge';
      } else if (dayOfWeek === 6) {
        style = 'dissabte';
      }

    }


    return style;
  };

}
