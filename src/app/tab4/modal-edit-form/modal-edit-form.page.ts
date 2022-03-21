import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-edit-form',
  templateUrl: './modal-edit-form.page.html',
  styleUrls: [],
})
export class ModalEditFormPage implements OnInit {

  
  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  questions = ["me duele la barriguita?","me he comido los moquillos hoy?",3,4,5];

  public async dismissModal() {
    const close: string = "Modal Removed";
    await this.modalController.dismiss(close);
  }

  public guardar(){
    console.log(this.questions)
  }
}
