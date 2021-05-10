import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexMarkers,
  ApexYAxis
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  fill: ApexFill;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-meterreader',
  templateUrl: './meterreader.component.html',
  styleUrls: ['./meterreader.component.css']
})
export class MeterreaderComponent implements OnInit {
  store = [];
  yaxis = [];
  ListData: Array<any>;
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions2: Partial<ChartOptions>;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/LastBoard', {}, { headers }).subscribe(result => {
        this.ListData = result.week;
     // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < result.week.length; i++) {
       this.store.push((result.week[i + 1].y - result.week[i].y).toFixed(2));
       this.yaxis.push(result.week[i].x);
     }
    });
    this.chartOptions2 = {
      series: [
        {
          name: 'Daily Consumption',
          data: this.store
        }
      ],
      chart: {
        height: 350,
        type: 'bar',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Last 7 days variations',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: this.yaxis
      }
    };
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function(){ window.dispatchEvent(new Event('resize')); }, 2000);



  }

ngOnInit(): void {
  }
}
