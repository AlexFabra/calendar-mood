import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { form_answers } from '../interfaces/form_answers.interface';
import { SqlConnectorService } from "../services/sql-connector.service";

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

  questions = [];
  answers = [];
  tags = [];
  currentDate: Date = new Date();
  formattedCurrentDate = formatDate(this.currentDate, 'dd/MM/yyyy', this.locale)
  //color per defecte del component ion-range:
  public color: string = "mood5";
  //variable que guarda l'estat d'ànim general diari de l'usuari:
  rangeValue: number = 5;

  public selectedTags: String[] = [];

  constructor(@Inject(LOCALE_ID) public locale: string, private sql: SqlConnectorService, public alertController: AlertController) {
  }

  /** cada vegada que s'entra a la pàgina s'executa aquesta funció:
   */
  ionViewWillEnter(): void {
    //obtenim últimes preguntes registrades a la bdd:
    this.sql.getLastQuestions().then((res) => {
      let resJson = res[0]
      this.questions = Object.keys(resJson).map((key) => {
        return resJson[key];
      })
      this.questions.splice(0, 1)
      return res;
    });

    //esborrem de l'array els elements sense informació:
    this.questions = this.questions.filter(question => !this.sql.isEmpty(question));

    //definim la longitud de les respostes segons la longitud de les preguntes:
    this.answers.length = this.questions.length;
    this.refreshForm();

    this.tags = [];
    this.sql.getAllTags().then((res) => {
      const resJSON = res;
      for (const tag of resJSON) {
        this.tags.push(tag.name)
      }
    })
  }

  public async refreshForm(): Promise<void> {
    //todo: hacer un get de si hay respuestas al dia de hoy y si las hay poder modificarlas
    const lastAnswer = await this.sql.getAnswersFromDate(this.formattedCurrentDate)
    //si lastAnswer no és vuida, obtenim els tags i les respostes d'ella
    if (!this.sql.isEmpty(lastAnswer)) {
      //obtenim els tags registrats del dia actual:
      const tagsArray = await this.sql.getUserTagFromId(lastAnswer[0].user_tags_id)
      const tagsJSON = tagsArray[0]
      this.selectedTags = [];
      Object.keys(tagsJSON).map((key) => {
        if (key === 'id' || tagsJSON[key] == '') {
        } else {
          this.selectedTags.push(tagsJSON[key])
        }
      })

      //obtenim les respostes registrades al dia actual:
      const lastAnswersJson = lastAnswer[0];
      this.answers = [];
      Object.keys(lastAnswersJson).map((key) => {
        if (key.includes("answer") && lastAnswersJson[key] !== '') {
          this.answers.push(lastAnswersJson[key])
        }
      })
    }
  }

  /** crea un alert que mostra a l'usuari que el registre s'ha guardat
 */
  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Registre guardat',
      subHeader: '',
      message: '',
      buttons: ['OK']
    });
    await alert.present();
  }

  /** Quan es fa submit del formulari s'executa aquesta funció
   *  envia al backend les dades
   */
  public async saveClick(): Promise<void> {

    //obtenim els tags i els passem a un JSON:
    const JSONselectedTags = {
      t1: this.selectedTags[0], t2: this.selectedTags[1],
      t3: this.selectedTags[2], t4: this.selectedTags[3], t5: this.selectedTags[4],
    };
    //si n'hi ha cap que sigui undefined, posem cometes:
    for (var clave in JSONselectedTags) {
      if (JSONselectedTags[clave] === undefined) {
        JSONselectedTags[clave] = "";
      }
    }
    //creem el json amb les respostes del formulari:
    const form = this.createFormAnswers(JSONselectedTags);

    //guardem a la bdd els tags seleccionats en quest dia:
    await this.sql.insertUserTags(JSONselectedTags);
    //guardem les respostes d'aquest dia:
    await this.sql.insertAnswer(form);

    //activem l'alerta:
    this.presentAlert();
  }

  /** Canvia el color del component ion-range segons el valor rebut
   * @param value CustomEvent
   */
  public rangeChange(value: any): void {
    this.rangeValue = value.detail.value;
    //els estils hi son a src/theme/variables.scss
    this.color = "mood" + this.rangeValue;
  }

  /**
     * Funció que donat un JSON amb els tags seleccionats per l'usuari retorna un JSON amb un JSON amb tots
     * els elements necessaris per poder enviar-lo a la BDD
     * @param JSONSelectedTags
     * @return json
     */
  public createFormAnswers(JSONselectedTags): form_answers {
    const form: form_answers =
    {
      date: this.formattedCurrentDate,
      percentage: this.rangeValue,
      tags: JSONselectedTags,
      a1: this.answers[0],
      a2: this.answers[1],
      a3: this.answers[2],
      a4: this.answers[3],
      a5: this.answers[4]
    };
    return form;
  }

  /** Esborra el tag passat dels seleccionats
 * @param tag
 */
  public deleteLabel(tag: String): void {
    this.selectedTags.splice(this.selectedTags.indexOf(tag), 1)
  }

}
