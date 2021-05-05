import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-consumerpending',
  templateUrl: './consumerpending.component.html',
  styleUrls: ['./consumerpending.component.css']
})
export class ConsumerpendingComponent implements OnInit {

  personList: Array<any>;
  act = 'active';
  inact = 'Inactive';
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/ConsumerUserInfo', {}, {headers}).subscribe(result => {
       this.personList = result.Users;
        });
   }
   editField: string;

   updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    this.personList[id][property] = editField;
  }

  remove(id: any, data) {
        this.personList.splice(id, 1);
        const token = localStorage.getItem('token');
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer ' + token);
        this.http.post<any>(environment.url + '/api/RemoveConsumerUserInfo', {consumedId: data}, {headers}).subscribe(result => {
        if (result.status === 1){
          location.reload();
        }
    });

  }


  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }
  ngOnInit(): void {
  }
}
