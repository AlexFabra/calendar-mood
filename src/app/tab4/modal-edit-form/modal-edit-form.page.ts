import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {SqlConnectorService} from "../../services/sql-connector.service";

@Component({
  selector: 'app-modal-edit-form',
  templateUrl: './modal-edit-form.page.html',
  styleUrls: [],
})
export class ModalEditFormPage implements OnInit {
  
  questions = [];

  /** 
   * @param modalController per gestionar el modal
   * @param sql per connectarse al servei i utilitzar les funcions
   * @param alertController per gestionar el alert
   */
  constructor(private modalController: ModalController, private sql: SqlConnectorService,public alertController: AlertController) {
  }

  /** ngOnInit s'executa quan s'inicia la pàgina:
   */
  ngOnInit() {
    //obtenim les últimes preguntes i les guardem a 'questions':
    this.sql.getLastQuestions().then((res) => {
      let resJson = res[0]
      this.questions = Object.keys(resJson).map((key) => {return resJson[key]; })
      this.questions.splice(0,1)
      return res;
    });
  }

  /** tanca el modal
   */
  public async dismissModal() {
    let questions = {
      q1: "aa",
      q2: "bb"
    }
    const close: string = "Modal Removed";
    await this.modalController.dismiss(close);
  }

  /** guardar guarda les preguntes posades i les envia a la bdd per que 
   *  actualitzi el formulari
   */
  public guardar() {
    //posem les noves preguntes a un JSON per passarles al backend:
    var questionsJSON = {
      q1: this.questions[0],
      q2: this.questions[1],
      q3: this.questions[2],
      q4: this.questions[3],
      q5: this.questions[4],
    }

    //si s'inserten les noves preguntes activem l'alert:
    this.sql.insertQuestions(questionsJSON).then((res) => {
      this.presentAlert();  
    })
  }

  /** crea un alert que mostra a l'usuari que les preguntes s'han canviat
   */
  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Preguntes actualitzades',
      subHeader: '',
      message: '',
      buttons: ['OK']
    });
    await alert.present();
  }
}
