import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SQLite} from '@awesome-cordova-plugins/sqlite/ngx';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {SQLitePorter} from '@awesome-cordova-plugins/sqlite-porter/ngx';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, SQLite, HttpClient, SQLitePorter],
  bootstrap: [AppComponent],
})
export class AppModule {}
