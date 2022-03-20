import { Component } from '@angular/core';
import {SqlConnectorService} from './services/sql-connector.service';
import {HttpClientModule} from '@angular/common/http';
import {SQLitePorter} from '@awesome-cordova-plugins/sqlite-porter/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(sqlServ: SqlConnectorService, httpClient: HttpClientModule, sqLitePorter: SQLitePorter) {
  }
}
