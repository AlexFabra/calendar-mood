import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SQLite} from '@awesome-cordova-plugins/sqlite/ngx';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {SQLitePorter} from '@awesome-cordova-plugins/sqlite-porter/ngx';

import { SqlConnectorService } from './services/sql-connector.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalEditFormPageModule } from './tab4/modal-edit-form/modal-edit-form.module';
import { ModalEditEmotionalLabelsPageModule } from './tab4/modal-edit-emotional-labels/modal-edit-emotional-labels.module';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, BrowserAnimationsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, SQLite, HttpClient, SQLitePorter],
  bootstrap: [AppComponent],
})
export class AppModule {}
