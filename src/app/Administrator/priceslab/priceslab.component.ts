import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-priceslab',
  templateUrl: './priceslab.component.html',
  styleUrls: ['./priceslab.component.css']
})
export class PriceslabComponent implements OnInit {

  public addresses: any[] = [{
    id: 1,
    from: '',
    to: '',
    price: '',
  }];
   todays;
BillRecords: Array<any>;
reversedList: Array<any>;
  constructor(private http: HttpClient) {
    // tslint:disable-next-line:prefer-const
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    this.todays = yyyy + '-' + mm + '-' + dd;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/PriceList', {}, {headers}).subscribe(result => {
      this.BillRecords = result.sort;

   });
  }

  onSubmit(data){
    const x = prompt('Enter "CONFIRM" to proceed, you will not be able to modify after the action');
    if (x === 'CONFIRM'){
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    // tslint:disable-next-line:max-line-length
    this.http.post<any>(environment.url + '/api/IssueBill', {
      billfrom : data.billfrom , billto: data.billto , duedate: data.duedate
    }, {headers})
    .subscribe(result => {
      if (result.status === 1){
         location.reload();
      }
  });
}
  }

  SlabRemove(){
    const x = prompt('Enter "CONFIRM" to proceed, you will not be able to modify after the action');
    if (x === 'CONFIRM'){
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    // tslint:disable-next-line:max-line-length
    this.http.post<any>(environment.url + '/api/SlabRemove', {}, {headers})
    .subscribe(result => {
      // tslint:disable-next-line:triple-equals
      if (result.status == 1){
         location.reload();
      }
  });
}

  }
  ngOnInit(): void {
  }


  addAddress() {
    this.addresses.push({
      id: this.addresses.length + 1,
      from: '',
      to: '',
      price: '',
    });
  }

  removeAddress(i: number) {
    this.addresses.splice(i, 1);
  }

  logValue() {
    console.log(this.addresses);
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/BillSlab', {data: this.addresses}, {headers}).subscribe(result => {
      const use = prompt('Enter "CONFIRM" to confirm action');
      if (use === 'CONFIRM'){
        location.reload();
      }
  });
  }
}
