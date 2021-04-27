import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, NgModule  } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CompareDirective } from './passwordchange.directive';

@Component({
  selector: 'app-passwordchange',
  templateUrl: './passwordchange.component.html',
  styleUrls: ['./passwordchange.component.css']
})

export class PasswordchangeComponent implements OnInit {
  public user: User;
  status = 0;
  firstname;
  lastname;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/userInfo', {}, { headers }).subscribe(result => {
              this.status = 1;
              this.firstname = result.firstname;
              this.lastname = result.lastname;
             });
}
  ngOnInit(): void {
    this.user = {
      password: '',
      confirmPassword: ''
  };
  }

  onSubmit(data){
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/PasswordChange'
      // tslint:disable-next-line:max-line-length
      , {password: data.password, newpassword: data.txtPassword}
      , {headers})
      .subscribe(result => {
        if (result.status){
          const x = confirm('Password changed successfully ! You will be logged out');
          if (x){
            localStorage.removeItem('token');
            location.reload();
          }
        }
    });
  }

}
export interface User {
  password: string;
  confirmPassword: string;
}
