import { Component } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import './tab2.page.css';

import { DateAdapter } from "@angular/material/core";
import { DatePipe } from '@angular/common';
import { SqlConnectorService } from '../services/sql-connector.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['./tab2.page.css']
})
export class Tab2Page {

  monthView: Date = new Date();
  selectedDate: String;
  selected: Date = new Date();
  moods:[]=[];

  constructor(date: DateAdapter<Date>, datePipe: DatePipe, private sql: SqlConnectorService) {
    //canvia el dia d'inici de la setmana a dilluns:
    date.getFirstDayOfWeek = () => 1;

    let formattedDate = this.obtainFormattedDate(this.monthView)
    this.sql.getMoodFromDate(formattedDate).then((res)=>{this.moods=res})
  }

  /** Assignar classes segons el dia.
   * @param cellDate element el valor del qual és la data.
   * @param view 'month' || 'year'
   * @returns nom de la classe que se li aplicarà al dia seleccionat.
   */
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {

    let style: String = '';
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
  }

    /** donada una Date, retorna un string que representa una data en format '__/01/2021'
 * @returns string
 */
     public obtainFormattedDate(date: Date): string {
      const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
      var fdModified = '__' + formattedDate.substring(2, formattedDate.length);
      return fdModified;
    }

}
