import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admindash',
  templateUrl: './admindash.component.html',
  styleUrls: ['./admindash.component.css']
})
export class AdmindashComponent implements OnInit {
  personList: Array<any>;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/BoardList', {}, {headers}).subscribe(result => {
       this.personList = result.Users;
        });
   }
   RemoveB(data){
    const use = prompt('Enter "CONFIRM" to confirm action');
    if (use === 'CONFIRM'){
      const token = localStorage.getItem('token');
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer ' + token);
      this.http.post<any>(environment.url + '/api/RemoveBoard', {board: data}, {headers}).subscribe(result => {
        // tslint:disable-next-line:triple-equals
        if (result.status == 1){
          location.reload();
        }
        });
      }
   }
  ngOnInit(): void {
  }

}
