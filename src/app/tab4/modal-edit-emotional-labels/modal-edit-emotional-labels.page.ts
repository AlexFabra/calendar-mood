import {ApplicationRef, Component} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SqlConnectorService } from 'src/app/services/sql-connector.service';

@Component({
  selector: 'app-modal-edit-emotional-labels',
  templateUrl: './modal-edit-emotional-labels.page.html',
  styleUrls: [],
})
export class ModalEditEmotionalLabelsPage {

  newLabel: String = "";

  tags: String[] = ["pau","ràbia","decepció","sol·litud","calidessa","alegria","tristessa","nostàlgia","angoixa","serenitat","inquietud"]

  constructor(private modalController: ModalController, private sql: SqlConnectorService, private appRef: ApplicationRef,) {
    //obtenim els tags de la bdd:
    this.getTags();
  }

  /** Afegeix el valor de newLabel a tags
   *  actualitza els tags
   *  i reinicia el valor de newLabel
   */
  public addLabel() {
    //nomes quan es faci l'insert farem l'altra petició a la bdd:
    this.sql.insertTag(this.newLabel).then((res)=>this.getTags());
    this.newLabel = "";
  }

  /** Esborra el tag passat com a paràmetre de la bdd
   *  i actualitza els tags
   * @param tag
   */
  public deleteLabel(tag: String) {
    this.sql.deleteTag(tag).then((res)=>this.getTags());
  }

  /** Tanca el modal
   */
  public async dismissModal() {
    const close: string = "Modal Removed";
    await this.modalController.dismiss(close);
  }

  /** S'obtenen els tags en format JSON de la bdd
   * i s'assignen a tags com a array
   */
  public async getTags() {
    this.tags = []
    console.log("getTags");

    //obtenim els tags de la base de dades:
    this.sql.getAllTags().then((res) => {
      console.log(res[0], "RESSSS");
      const resJSON = res;
      for (const tag of resJSON) {
        this.tags.push(tag.name)
      }

    })
  }
}
