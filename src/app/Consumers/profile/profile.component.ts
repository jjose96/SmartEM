import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  status: number;
  consumerId;
  firstname;
  lastname;
  address;
  city;
  phone;
  email;
  pincode;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/profileInfo', {}, { headers }).subscribe(result => {
           this.consumerId = result.consumerId;
           this.firstname = result.firstname;
           this.lastname = result.lastname;
           this.address = result.address;
           this.email = result.email;
           this.city = result.city;
           this.phone = result.phone;
           this.pincode = result.pincode;
  });

  }
  OnSubmit(data){
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/ProfileUpdate'
      // tslint:disable-next-line:max-line-length
      , {firstname: data.firstname, lastname: data.lastname, phone: data.phone, address: data.address, city: data.city, pincode: data.pincode}
      , {headers})
      .subscribe(result => {
        status = result.status;
    });
  }
  ngOnInit(): void {
  }

}
