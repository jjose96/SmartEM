import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexStroke,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexXAxis,
  ApexFill,
  ApexPlotOptions,
  ApexMarkers,
  ApexGrid
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  annotations: any; // ApexAnnotations;
  grid: ApexGrid;
  yaxis: any; // ApexYAxis;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  markers: ApexMarkers;
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
  last;
  usera;
  userp;
  lastdue;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);

    this.delay(1000).then(() => {
      this.http.post<any>(environment.url + '/api/LastBoard', {}, { headers }).subscribe(result => {
        this.last = result.week[result.week.length - 1].y;
    });
 });
    this.http.post<any>(environment.url + '/api/UsersTotal', {}, { headers }).subscribe(result => {
  this.usera = result.userc;
});
    this.http.post<any>(environment.url + '/api/UsersPending', {}, { headers }).subscribe(result => {
  this.userp = result.userp;

});
    this.http.post<any>(environment.url + '/api/LastDue', {}, { headers }).subscribe(result => {
  this.lastdue = result.lastdue;

});
}
async delay(ms: number) {
  await new Promise<void>(resolve => setTimeout(() => resolve(), ms)).then(() => console.log());
}
  ngOnInit(): void {
  }
      }
