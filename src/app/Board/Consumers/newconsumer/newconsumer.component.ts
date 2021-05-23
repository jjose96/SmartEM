import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-newconsumer',
  templateUrl: './newconsumer.component.html',
  styleUrls: ['./newconsumer.component.css']
})
export class NewconsumerComponent implements OnInit {
  personList: Array<any>;
  act = 'Active';
  inact = 'Inactive';
  options: Array<any>;

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

  onSearchChange(searchValue: string): void {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/SearchUser', {search: searchValue}, {headers}).subscribe(result => {
      this.options = result.users;
        });
  }
  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }
  ngOnInit(): void {
  }


}
