import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Router} from '@angular/router';


@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.css']
})
export class ForgotpassComponent implements OnInit {
status = 0;
  constructor(private http: HttpClient , private router: Router) { }

  ngOnInit(): void {
  }
OnSubmit(data){
  this.http.post<any>(environment.url + '/api/forgot', { consumerid: data.consumerid }).subscribe(result => {
    // tslint:disable-next-line:triple-equals
    if (result.status == 1){
      alert('If your already a registered member, we\'ve just sent you an email to reset your password.');
      this.router.navigateByUrl('/');

}
 });
}
}
console.log(status);
