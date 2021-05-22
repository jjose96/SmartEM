import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-addboard',
  templateUrl: './addboard.component.html',
  styleUrls: ['./addboard.component.css']
})
export class AddboardComponent implements OnInit {
  status = 2;
  constructor(private http: HttpClient) { }
OnSubmit(data){
  const token = localStorage.getItem('token');
  let headers = new HttpHeaders();
  headers = headers.set('Authorization', 'Bearer ' + token);
  // tslint:disable-next-line:max-line-length
  this.http.post<any>(environment.url + '/api/CreateBoard', {name: data.name, user: data.user, password: data.password}, {headers}).subscribe(result => {
     this.status = result.status;
  });
}

  ngOnInit(): void {
  }

}
