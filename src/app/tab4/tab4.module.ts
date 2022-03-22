import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab4Page } from './tab4.page';
import { Tab1PageRoutingModule } from './tab4-routing.module';
import {ModalEditFormPageModule} from "./modal-edit-form/modal-edit-form.module";
import {ModalEditEmotionalLabelsPageModule} from "./modal-edit-emotional-labels/modal-edit-emotional-labels.module";


@NgModule({
  declarations: [Tab4Page],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    ModalEditFormPageModule,
    ModalEditEmotionalLabelsPageModule
  ],
  providers: []

})
export class Tab4PageModule {}
