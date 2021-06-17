import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-conprofile',
  templateUrl: './conprofile.component.html',
  styleUrls: ['./conprofile.component.css']
})
export class ConprofileComponent implements OnInit {
firstname: string;
lastname: string;
consumerid;
email: string;
address: string;
phone: string;
city: string;
pincode: string;
daily;
month;
reading;
status;
tok = '';
  constructor(private http: HttpClient, private location: Location) {
    const userid = window.location.pathname.split('/').pop();
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/ProfileUser', {user: userid}, {headers}).subscribe(result => {
      this.firstname = result.firstname;
      this.lastname = result.lastname;
      this.consumerid = result.consumerid;
      this.email = result.email;
      this.address = result.address;
      this.phone = result.phone;
      this.city = result.city;
      this.pincode = result.pincode;
      this.status = result.status;
        });
    this.http.post<any>(environment.url + '/api/UserConsumption', {user: userid}, {headers}).subscribe(result => {
this.daily = result.daily;
this.month = result.month;
this.reading = result.reading;
            });
   }
    ngOnInit(): void {
  }

  remove() {
    const x = confirm('Are you sure you want to delete this profile?');
    if (x){
     const data = window.location.pathname.split('/').pop();
     const token = localStorage.getItem('token');
     let headers = new HttpHeaders();
     headers = headers.set('Authorization', 'Bearer ' + token);
     this.http.post<any>(environment.url + '/api/RemoveConsumerUserInfo', {consumedId: data}, {headers}).subscribe(result => {
     if (result.status === 1){
       location.href = '/dashboard/consumers/';
     }
    });

    }
  }

  generateKey() {
    const use = prompt('Enter "CONFIRM" to confirm action');
    if (use === 'CONFIRM'){
     const data = window.location.pathname.split('/').pop();
     const token = localStorage.getItem('token');
     let headers = new HttpHeaders();
     headers = headers.set('Authorization', 'Bearer ' + token);
     this.http.post<any>(environment.url + '/api/generateKey', {consumedId: data}, {headers}).subscribe(result => {
     // tslint:disable-next-line:triple-equals
     if (result.status == 1){
        this.tok = result.dpass;
      }
    });

    }
  }
  goBack() {
    // window.history.back();
    this.location.back();

  }
}
