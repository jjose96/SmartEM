import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {
  BillRecords: Array<any>;
  reversedList: Array<any>;
  bstatus: any;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/UserBills', {}, {headers}).subscribe(result => {
      this.BillRecords = result.record;
      this.reversedList = this.BillRecords.slice().reverse();

   });
   }
PayBill(data){
const token = localStorage.getItem('token');
let headers = new HttpHeaders();
headers = headers.set('Authorization', 'Bearer ' + token);
this.http.post<any>(environment.url + '/api/PayBill', {billid: data}, {headers}).subscribe(result => {
  this.bstatus = result.status;
  // tslint:disable-next-line:triple-equals
  if (this.bstatus == 1){
    alert('Bill Paid');
    location.reload();
  }
});
}
  ngOnInit(): void {
  }

}
