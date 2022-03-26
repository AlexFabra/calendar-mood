import { Component, OnInit } from '@angular/core';
import { BarChart, LineChart, PieChart, PieSeriesOption } from "echarts/charts";
import { EChartsOption } from 'echarts';
import { TooltipComponent, GridComponent, LegendComponent } from "echarts/components";
import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";
import { SqlConnectorService } from '../services/sql-connector.service';
import { DatePipe } from '@angular/common';
import { Options } from 'selenium-webdriver';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: []
})
export class Tab3Page {

  readonly echartsExtentions: any[];
  option: EChartsOption = {};

  //TODO: estos datos tienen que venir del backend:
  monthOptions: String[] = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];
  yearOptions: String[] = ['2022', '2023', '2024'];

  currentDate: Date = new Date();
  currentYear: number = this.currentDate.getFullYear();
  currentMonth: number = this.currentDate.getMonth() + 1;

  selectedMonth: String = this.monthOptions[this.currentMonth];
  selectedYear: String = this.currentYear.toString();

  unselected: boolean = true;

  numColumns: number = 2; // number of columns to display on picker over lay
  numOptions: number = 5  // number of items (or rows) to display on

  //array on guardarem les emocions i el nombre de registres que hi ha de cadascuna:
  data = [];

  constructor(private pickerCtrl: PickerController, private sql: SqlConnectorService, private datePipe: DatePipe) {
    this.echartsExtentions = [
      BarChart,
      LineChart,
      TooltipComponent,
      GridComponent,
      LegendComponent,
      PieChart
    ];
  }

  async ionViewWillEnter() {
    this.createChart();
  }
  /** showPicker mostra el selector de data:
   * 
   */
  async showPicker() {
    let opts = {
      buttons: [
        {
          text: 'cancel·la',
          role: 'cancel'
        },
        {
          text: 'Confirma',
          handler: (value) => {
            this.changeDate(value.month.text, value.year.text);
            this.data=null;
            this.option=null;
            this.initializeData();
            
          }
        }
      ],
      columns: [
        {
          name: 'month',
          prefix: 'mes:',
          options: this.getMonthOptions(),
          selectedIndex: this.currentMonth
        },
        {
          name: 'year',
          prefix: 'any:',
          options: this.getYearOptions()
        }
      ]
    };

    let picker = await this.pickerCtrl.create(opts);
    picker.present();
    this.unselected = false;
  }
  /** afegeix a options el contingut de monthOptions
   * @returns options
   */
  getMonthOptions() {
    let options = [];
    this.monthOptions.forEach(x => {
      options.push({ text: x, value: x });
    });
    return options;
  }
  /** afegeix a options el contingut de yearOptions
   * @returns options
   */
  getYearOptions() {
    let options = [];
    this.yearOptions.forEach(x => {
      options.push({ text: x, value: x });
    });
    return options;
  }

  /** donat un mes i un any, modifica les variables que determinen la selecció de date
   * @param month 
   * @param year 
   */
  changeDate(month, year) {
    this.selectedMonth = month;
    this.selectedYear = year;
    this.currentDate=new Date(year,month,1);
    this.unselected = true;
  }
  
  /** donada una Date, retorna un string que representa una data en format '__/01/2021'
 * @returns string
 */
  public obtainFormattedDate(date: Date): string {
    const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
    var fdModified = '__' + formattedDate.substring(2, formattedDate.length);
    return fdModified;
  }
  async createChart() {
    await this.initializeData();

    //configuració del chart:
    this.option = {
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          data: this.data,
          animation: true,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '25'
            }
          },
          labelLine: {
            show: false
          },
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      ],
      legend: [
        {
          data: this.data
        }
      ],
    };

  }

  async initializeData() {
    this.data = [];
    //obtenim la date per cercar els tags segons aquesta:
    const formattedDate = this.obtainFormattedDate(this.currentDate)

    //obtenim tots els tags:
    const tags = await this.sql.getAllTags();

    //Agafem tots els tags i comprovem la quantitat d'aquests per mes i els afegim a l'array de Json 'data'
    for (const tag of tags) {
      const tagQuant = await this.sql.getTagQuantFromDate(formattedDate, tag.name)
      //només es mostraràn els tags utilitzats:
      if (tagQuant !== 0) {
        this.data.push({ name: tag.name, value: tagQuant })
      }
    }
  }
}
