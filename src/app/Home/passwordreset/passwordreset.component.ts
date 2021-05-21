import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, NgModule  } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PasswordResetDirective } from './passwordreset.directive';
import {Router} from '@angular/router';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.css']
})
export class PasswordresetComponent implements OnInit {
  public users: User;
state;
note;
  constructor(private http: HttpClient, private router: Router) { }
  onSubmit(data){
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/PasswordReset'
      // tslint:disable-next-line:max-line-length
      , {password: data.txtPassword}
      , {headers})
      .subscribe(result => {
        this.state = result.status;
        console.log(result.status);
        // tslint:disable-next-line:triple-equals
        if (this.state == 1){
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          const x = confirm('Password Changed ! Goto Login');
          if (x){
            this.router.navigateByUrl('/');

          }
        }
        else{
          this.state = 0;
          this.note = 'Invalid token';
        }
    });
  }
  ngOnInit(): void {
    this.users = {
      password: '',
      confirmPassword: ''
  };
  }

}
export interface User {
  password: string;
  confirmPassword: string;
}
