import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalEditEmotionalLabelsPage } from './modal-edit-emotional-labels.page';

const routes: Routes = [
  {
    path: '',
    component: ModalEditEmotionalLabelsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalEditEmotionalLabelsPageRoutingModule {}
