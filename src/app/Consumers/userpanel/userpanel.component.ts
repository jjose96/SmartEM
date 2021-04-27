import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as $ from 'jquery';
@Component({
  selector: 'app-userpanel',
  templateUrl: './userpanel.component.html',
  styleUrls: ['./userpanel.component.scss']
})
export class UserpanelComponent implements OnInit {
  mob = 0;
  status;
  user;
  shr = 0;
  constructor(private http: HttpClient) {
    // tslint:disable-next-line:prefer-const
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/userInfo', {}, {headers}).subscribe(result => {
       if (result.status === 1){
              this.status = 1;
              this.user = result.firstname + ' ' + result.lastname;
             }
      else if (result.status === 0){
        this.status = 0;
        window.alert('Session expired ! Login again');
        location.replace('/');
      }
      else{}
  });
    // tslint:disable-next-line:variable-name

    if (screen.width < 768){
      this.mob = 1;
    }

}
 Drive(){
   this.shr = 1;
 }

  ngOnInit(): void {
  }

}
