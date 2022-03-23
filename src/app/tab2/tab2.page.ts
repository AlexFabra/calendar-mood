import { Component, ViewChild } from '@angular/core';
import { MatCalendar, MatCalendarCellClassFunction } from '@angular/material/datepicker';
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

  @ViewChild('monthCalendar') monthCalendar!: MatCalendar<Date>;
  monthView: Date = new Date();
  selectedDate: String;
  selected: Date = new Date();
  moods = [];

  /**cada vegada que s'entri a aquesta funció s'actualitzarà el calendari.
    *  aixó implica que les classes del calendari també, pel que quan es registri un formulari
    *  el canvi al calendari apareixerà al entrar. 
   */
  ionViewWillEnter() {
    let formattedDate = this.obtainFormattedDate(this.monthView)
    //obtenim els moods:
    this.sql.getMoodFromDate(formattedDate).then((res) => { this.moods = res })
    //actualitzem el calendari:
    this.monthCalendar.updateTodaysDate();
  }

  constructor(date: DateAdapter<Date>, private datePipe: DatePipe, private sql: SqlConnectorService) {
    //canvia el dia d'inici de la setmana a dilluns:
    date.getFirstDayOfWeek = () => 1;

  }

  /** Assignar classes segons el dia.
   * @param cellDate element el valor del qual és la data.
   * @param view 'month' || 'year'
   * @returns nom de la classe que se li aplicarà al dia seleccionat.
   */
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {

    const formattedDate = this.datePipe.transform(cellDate, 'dd/MM/yyyy');

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

    this.moods.map((day) => {
      console.log(day, day.date, day.mood)
      if (day.date === formattedDate) {
        console.log("trobada data", day.date, "amb mood", day.mood)
        style = "mood" + day.mood;
        console.log("estil", style)
      }
    })
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
