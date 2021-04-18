import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as $ from 'jquery';
@Component({
  selector: 'app-sidebardash',
  templateUrl: './sidebardash.component.html',
  styleUrls: ['./sidebardash.component.css']
})
export class SidebardashComponent implements OnInit {

  status = 0;
  user;
  constructor(private http: HttpClient) {
    // tslint:disable-next-line:prefer-const
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/userInfo', {}, { headers }).subscribe(result => {
       if (result.status === 1){
              this.status = 1;
              this.user = result.firstname + ' ' + result.lastname;
             }
  });


}

OnLogout(){
  localStorage.removeItem('token');
  location.replace('/');
}

  ngOnInit(): void {
  }

}
