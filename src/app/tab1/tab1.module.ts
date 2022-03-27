import { IonicModule } from '@ionic/angular';
import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';


import localeCa from '@angular/common/locales/ca';

registerLocaleData(localeCa);

@NgModule({
  declarations: [Tab1Page],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ca' }]

})
export class Tab1PageModule {}
