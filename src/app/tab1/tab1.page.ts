import {formatDate} from '@angular/common';
import {Component, Inject, LOCALE_ID} from '@angular/core';
import {form_answers} from '../interfaces/form_answers.interface';
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
  questions = ["", "", "", "", ""];
  answers = ["", "", "", "", ""];
  tags = [];
  currentDate: Date = new Date();
  formattedCurrentDate = formatDate(this.currentDate, 'dd/MM/yyyy', this.locale)

  constructor(@Inject(LOCALE_ID) public locale: string, private sql: SqlConnectorService) {
  }

  ionViewWillEnter(){
    this.sql.getLastQuestions().then((res) => {
      let resJson = res[0]
      this.questions = Object.keys(resJson).map((key) => {
        return resJson[key];
      })
      this.questions.splice(0, 1)

      return res;
    });

    //esborrem de l'array els llocs que estàn buits ( si n'hi ha):
    this.questions=this.questions.filter(question => question != "")
    //definim la longitud de les respostes segons la longitud de les preguntes:
    this.answers.length=this.questions.length;
    this.refreshForm();

    this.sql.getAllTags().then((res) => {
      const resJSON = res;
      for (const tag of resJSON) {
        this.tags.push(tag.name)
      }
    })

  }

  public async refreshForm(){
    console.log("REFRESH FORM")
    //todo: hacer un get de si hay respuestas al dia de hoy y si las hay poder modificarlas
    const lastAnswer = await this.sql.getAnswersFromDate(this.formattedCurrentDate)

    if(!this.sql.isEmpty(lastAnswer)){
      console.log(lastAnswer[0])
      const tags = await this.sql.getUserTagFromId(lastAnswer[0].user_tags_id)
      console.log(tags[0], "tag[0]")


      //para coger el resultado de tags utilizar tags[0] ACUERDATE PAPI

    }
  }

  //color per defecte del component ion-range:
  public color: string = "tertiary";
  //variable que guarda l'estat d'ànim general diari de l'usuari:
  rangeValue: number = 5;

  public selectedTags: String[] = [];

  /** Quan es fa submit del formulari s'executa aquesta funció
   *  envia al backend les dades
   */
  public async saveClick() {
    //TODO: Enviar les dades a backend
    // console.log(this.pregunta1);
    // console.log(this.pregunta2);
    // console.log(this.pregunta3)
    // console.log(this.selectedTags)

    //obtenim els tags i els passem a un JSON:
    const JSONselectedTags = {
      t1: this.selectedTags[0], t2: this.selectedTags[1],
      t3: this.selectedTags[2], t4: this.selectedTags[3], t5: this.selectedTags[4],
    };

    for (var clave in JSONselectedTags) {
      if (JSONselectedTags[clave] === undefined) {
        JSONselectedTags[clave] = "";
      }
    }

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
      }

    const questionsJson = {
      q1: this.questions[0],
      q2: this.questions[1],
      q3: this.questions[2],
      q4: this.questions[3],
      q5: this.questions[4]
    }


    console.log(JSON.stringify(Object.assign({}, this.selectedTags)))
    console.log(JSONselectedTags, "JSONselectedTags")

    await this.sql.insertUserTags(JSONselectedTags)
    await this.sql.insertQuestions(questionsJson)

    const lastQuestion = await this.sql.getLastQuestions()
    const questionId = lastQuestion[0].id
    const lastUserTags = await this.sql.getLastUserTags()
    const userTagsId = lastUserTags[0].id

    form["formId"] = questionId
    form["userTagId"] = userTagsId
    console.log(form, "ANSWERS")
    await this.sql.insertAnswer(form)

    console.log(await this.sql.getAllRows(), "ALL ROWS")

  }

  /** Canvia el color del component ion-range segons el valor rebut
   * @param value CustomEvent
   */
  public rangeChange(value: any) {
    this.rangeValue = value.detail.value
    switch (value.detail.value) {
      case 0:
        this.color = "mood"+value.detail.value
        break;
      case 1:
        this.color = "dark"
        break;
      case 2:
        this.color = "dark"
        break;
      case 3:
        this.color = "danger"
        break;
      case 4:
        this.color = "warning"
        break;
      case 5:
        this.color = "tertiary"
        break;
      case 6:
        this.color = "secondary"
        break;
      case 7:
        this.color = "primary"
        break;
      case 8:
        this.color = "success"
        break;
      case 9:
        this.color = "medium"
        break;
      case 10:
        this.color = "light"
        break;
      default:
        this.color = "dark"
    }
  }
}
