import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, NgModule  } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PushNotificationsService} from 'ng-push';

@Component({
  selector: 'app-limitwarning',
  templateUrl: './limitwarning.component.html',
  styleUrls: ['./limitwarning.component.css']
})
export class LimitwarningComponent implements OnInit {
  firstname;
  lastname;
  limitunit = 0 ;
  // tslint:disable-next-line:variable-name
  constructor(private http: HttpClient, private _pushNotifications: PushNotificationsService) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/userInfo', {}, { headers }).subscribe(result => {
              this.firstname = result.firstname;
              this.lastname = result.lastname;
             });
    this.http.post<any>(environment.url + '/api/GetLimit', {}, { headers }).subscribe(result => {
          this.limitunit = result.unit;
             });
    this._pushNotifications.requestPermission();

   }

  ngOnInit(): void {
  }
onSubmit(data){
  const token = localStorage.getItem('token');
  let headers = new HttpHeaders();
  headers = headers.set('Authorization', 'Bearer ' + token);
  this.http.post<any>(environment.url + '/api/SetLimit'
    // tslint:disable-next-line:max-line-length
    , {unit : data.unit}
    , {headers})
    .subscribe(result => {
      if (result.status === 1){
        alert('Usage limit is set');
      }
  });
}
}
