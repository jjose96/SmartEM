import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, NgModule  } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
today;
month;
monthprice;
duedate;
WeekList: Array<any>;
reversedList: Array<any>;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/ConsumerDashboard', {}, { headers }).subscribe(result => {
     });
    this.delay(2000).then(() => {
    this.http.post<any>(environment.url + '/api/ConsumerDashboard', {}, { headers }).subscribe(result => {
              this.today = result.today;
              this.month = result.month;
             });
            });
    this.http.post<any>(environment.url + '/api/Last7Days', {}, {headers}).subscribe(result => {
              this.WeekList = result.week;
              this.reversedList = this.WeekList.slice().reverse();
               });
    this.delay(2000).then(() => {
    this.http.post<any>(environment.url + '/api/MonthlyCharge', {}, {headers}).subscribe(result => {
              this.monthprice = result.charge;
           });
          });
    this.http.post<any>(environment.url + '/api/LastDueDate', {}, {headers}).subscribe(result => {
            this.duedate = result.duedate;
         });
   }
   reload(){
    location.reload();
   }
   async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(() => resolve(), ms)).then(() => console.log());
  }
  ngOnInit(): void {
  }
}
