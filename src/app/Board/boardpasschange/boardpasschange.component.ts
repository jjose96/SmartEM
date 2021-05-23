import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, NgModule  } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BPassDirective } from './boardpasschange.directive';

@Component({
  selector: 'app-boardpasschange',
  templateUrl: './boardpasschange.component.html',
  styleUrls: ['./boardpasschange.component.css']
})
export class BoardpasschangeComponent implements OnInit {
  public user: User;
  firstname;
  lastname;
  status: any;
  constructor(private http: HttpClient) {
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
    this.http.post<any>(environment.url + '/api/BPasswordChange'
      // tslint:disable-next-line:max-line-length
      , {password: data.password, newpassword: data.txtPassword}
      , {headers})
      .subscribe(result => {
        this.status = result.status;
        if (result.status){
          const x = confirm('Password changed successfully ! You will be logged out');
          if (x){
            localStorage.removeItem('token');
            location.href = '/';
          }
        }
    });
  }

}

export interface User {
  password: string;
  confirmPassword: string;
}
