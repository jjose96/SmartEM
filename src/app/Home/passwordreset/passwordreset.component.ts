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
state = 2;
note;
  constructor(private http: HttpClient, private router: Router) { }
  onSubmit(data){
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/PasswordReset'
      // tslint:disable-next-line:max-line-length
      , {address: data.address, city: data.city, pincode: data.pincode, password: data.txtPassword}
      , {headers})
      .subscribe(result => {
        this.state = result.status;
        if (this.state){
          const x = confirm('Profile verified ! Goto Login');
          if (x){
            this.router.navigateByUrl('/');

          }
        }
        else{
          this.state = 0;
          this.note = 'Account already verified or token got expired';
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
