import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalEditEmotionalLabelsPageRoutingModule } from './modal-edit-emotional-labels-routing.module';

import { ModalEditEmotionalLabelsPage } from './modal-edit-emotional-labels.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalEditEmotionalLabelsPageRoutingModule
  ],
  declarations: [ModalEditEmotionalLabelsPage]
})
export class ModalEditEmotionalLabelsPageModule {}
