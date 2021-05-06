import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-conprofile',
  templateUrl: './conprofile.component.html',
  styleUrls: ['./conprofile.component.css']
})
export class ConprofileComponent implements OnInit {
firstname: string;
lastname: string;
consumerid: string;
email: string;
address: string;
phone: string;
city: string;
pincode: string;
daily;
month;
reading;
status;
  constructor(private http: HttpClient) {
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

}
