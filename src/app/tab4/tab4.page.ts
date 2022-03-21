import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalEditEmotionalLabelsPage } from './modal-edit-emotional-labels/modal-edit-emotional-labels.page';
import { ModalEditFormPage } from './modal-edit-form/modal-edit-form.page';

interface Tag {
  name: String;
  color: String;
}

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: []
})

export class Tab4Page {

  constructor(public modalController: ModalController) { }

  async modificarPreguntes(){
    const modal = await this.modalController.create({
      component: ModalEditFormPage
    });
    return await modal.present();
  }

  async modificarEtiquetes(){
    const modal = await this.modalController.create({
      component: ModalEditEmotionalLabelsPage
    });
    return await modal.present();
  }
  
}
