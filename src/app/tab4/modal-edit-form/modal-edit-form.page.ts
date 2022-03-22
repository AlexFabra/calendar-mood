import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {SqlConnectorService} from "../../services/sql-connector.service";

@Component({
  selector: 'app-modal-edit-form',
  templateUrl: './modal-edit-form.page.html',
  styleUrls: [],
})
export class ModalEditFormPage implements OnInit {
  questions = [];

  constructor(private modalController: ModalController, private sql: SqlConnectorService) {
  }

  ngOnInit() {
    this.sql.getLastQuestions().then((res) => {
      let resJson = res[0]
      this.questions = Object.keys(resJson).map((key) => {return resJson[key]; })
      this.questions.splice(0,1)

      return res;
    });
  }

  // questions = ["me duele la barriguita?","me he comido los moquillos hoy?",3,4,5];

  public async dismissModal() {
    let questions = {
      q1: "aa",
      q2: "bb"
    }
    const close: string = "Modal Removed";
    await this.modalController.dismiss(close);
  }

  public guardar() {
    console.log(this.questions)

    var questionsJSON = {
      q1: this.questions[0],
      q2: this.questions[1],
      q3: this.questions[2],
      q4: this.questions[3],
      q5: this.questions[4],
    }

    this.sql.insertQuestions(questionsJSON).then((res) => {
      console.log("formulari actualitzat")
    })
  }
}
