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
  questions = [];
  answers = [];
  mood;
  tags = []

  /**cada vegada que s'entri a aquesta funció s'actualitzarà el calendari.
    *  aixó implica que les classes del calendari també, pel que quan es registri un formulari
    *  el canvi al calendari apareixerà al entrar.
   */
  ionViewWillEnter() {
    let formattedDate = this.obtainFormattedDate(this.monthView)
    //obtenim els moods:
    this.sql.getMoodFromDate(formattedDate).then((res) => { this.moods = res })
    //actualitzem el calendari:
    this.getChangedValue(this.monthView);
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
      //recorrem els moods i si algun registre coincideix amb la data l'obtenim i li posem l'estil
      this.moods.map((day) => {
        if (day.date === formattedDate) {
          style = 'mood' + day.mood
        }
      })
    }
    return style;
  }

  /** S'executa quan canvia el event clicat de matCalendar 
   *  obté la informació del dia clicat
   * @param event Date
   */
  async getChangedValue(event: Date | null) {

    //vuidem les preguntes i respostes:
    this.questions = [];
    this.answers = [];
    this.mood = [];
    this.tags = [];
    let formId;

    //obtenim el dia amb el format que espera com a paràmetre la funció del backend corresponent
    const selectedDay: string = this.datePipe.transform(event, 'dd/MM/yyyy');
    //obtenim les respostes del dia (si n'hi han)
    const answer = await this.sql.getAnswersFromDate(selectedDay)

    if (!this.sql.isEmpty(answer[0])) {
      //guardem el id per obtenir les preguntes:
      formId = answer[0].form_id

      //guardem les respostes organitzades:
      this.guardarRespostes(answer);

      //recorrem els moods i si algun registre coincideix amb la data l'obtenim i li posem l'estil
      this.moods.map((day) => {
        if (day.date === selectedDay) {
          this.mood = day.mood;
        }
      })

      //obtenim les preguntes:
      await this.sql.getQuestionsFromId(formId).then((res) => {
        if (!this.sql.isEmpty(res[0])) {
          let resJson = res[0]
          this.questions = Object.keys(resJson).map((key) => {
            return resJson[key];
          })
          this.questions.splice(0, 1)
          return res;
        }
      });

      //obtenim els tags del dia:
      const tags = await this.sql.getUserTagFromId(answer[0].user_tags_id).then((res) => {
        if (!this.sql.isEmpty(res[0])) {
          let resJson = res[0]
          this.tags = Object.keys(resJson).map((key) => {
            return resJson[key];
          })
          //esborrem el id, que hi hes al primer lloc de l'array
          this.tags.splice(0, 1)
          //esborrem els elements vuits:
          this.tags = this.tags.filter(tag => tag.length > 1);

          return res;
        }
      });


    }


    this.monthCalendar.updateTodaysDate();
  }

  /** donada una Date, retorna un string que representa una data en format '__/01/2021'
   * @returns string
   */
  public obtainFormattedDate(date: Date): string {
    const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
    var fdModified = '__' + formattedDate.substring(2, formattedDate.length);
    return fdModified;
  }

  public guardarRespostes(answer): void {
    //si la resposta del backend no és vuida:
    if (!this.sql.isEmpty(answer[0])) {
      //obtenim les respostes:
      const lastAnswersJson = answer[0];
      Object.keys(lastAnswersJson).map((key) => {
        if (key.includes("answer") && lastAnswersJson[key] !== '') {
          this.answers.push(lastAnswersJson[key])
        }
      })
    }
  }
}
