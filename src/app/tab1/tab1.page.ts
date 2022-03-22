import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { form_answers } from '../interfaces/form_answers.interface';
import {SqlConnectorService} from "../services/sql-connector.service";


interface Tag {
  name: string;
  color: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: []
})

export class Tab1Page {

  constructor(@Inject(LOCALE_ID) public locale: string, sql:SqlConnectorService) { }

  currentDate: Date = new Date();

  //color per defecte del component ion-range:
  public color: string = "tertiary";
  //variable que guarda l'estat d'ànim general diari de l'usuari:
  rangeValue: number = 5;

  public tags: Tag[] = [
    { name: "alegria", color: "primary" },
    { name: "tristessa", color: "tertiary" },
    { name: "pau", color: "light" },
    { name: "serenitat", color: "dark" },
    { name: "ira", color: "blue" },
    { name: "ràbia", color: "red" },
    { name: "inquietud", color: "blue" }
  ]

  public selectedTags: String[] = [];

  pregunta1: String = "";
  pregunta2: String = "";
  pregunta3: String = "";
  pregunta4: String = "";
  pregunta5: String = "";

  /** Quan es fa submit del formulari s'executa aquesta funció
   *  envia al backend les dades
   */
  public saveClick() {
    //TODO: Enviar les dades a backend
    // console.log(this.pregunta1);
    // console.log(this.pregunta2);
    // console.log(this.pregunta3)
    // console.log(this.selectedTags)

    //obtenim els tags i els passem a un JSON:
    const JSONselectedTags = { t1: this.selectedTags[0], t2: this.selectedTags[1], t3: this.selectedTags[2], t4: this.selectedTags[3], t5: this.selectedTags[4] };

    for (var clave in JSONselectedTags) {
      if (JSONselectedTags[clave] === undefined) {
        JSONselectedTags[clave] = "";
      }
    }

    const form: form_answers =
    {
      date: formatDate(this.currentDate, 'dd/MM/yyyy', this.locale),
      percentage: this.rangeValue,
      tags: JSONselectedTags,
      a1: this.pregunta1,
      a2: this.pregunta2,
      a3: this.pregunta3,
      a4: this.pregunta4,
      a5: this.pregunta5
    }



    console.log(JSON.stringify(Object.assign({}, this.selectedTags)))
    console.log(JSONselectedTags)
    console.log(form)

  }

  /** Canvia el color del component ion-range segons el valor rebut
   * @param value CustomEvent
   */
  public rangeChange(value: any) {
    this.rangeValue = value.detail.value
    switch (value.detail.value) {
      case 0: this.color = "dark"
        break;
      case 1: this.color = "dark"
        break;
      case 2: this.color = "dark"
        break;
      case 3: this.color = "danger"
        break;
      case 4: this.color = "warning"
        break;
      case 5: this.color = "tertiary"
        break;
      case 6: this.color = "secondary"
        break;
      case 7: this.color = "primary"
        break;
      case 8: this.color = "success"
        break;
      case 9: this.color = "medium"
        break;
      case 10: this.color = "light"
        break;
      default:
        this.color = "dark"
    }
  }
}
