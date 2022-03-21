import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-edit-emotional-labels',
  templateUrl: './modal-edit-emotional-labels.page.html',
  styleUrls: [],
})
export class ModalEditEmotionalLabelsPage implements OnInit {

  newLabel: String = "";

  tags: String[] = ["mayestático", "esperpéntico", "plusquamperfecto"]

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  public addLabel() {
    this.tags.push(this.newLabel)
    this.newLabel = "";
  }

  public deleteLabel(tag: String) {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
    }
  }

  public async dismissModal() {
    const close: string = "Modal Removed";
    await this.modalController.dismiss(close);
  }

}
