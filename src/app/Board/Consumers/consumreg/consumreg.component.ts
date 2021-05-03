import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-consumreg',
  templateUrl: './consumreg.component.html',
  styleUrls: ['./consumreg.component.css']
})
export class ConsumregComponent implements OnInit {

  constructor(private http: HttpClient) { }
OnSubmit(data){
  const token = localStorage.getItem('token');
  let headers = new HttpHeaders();
  headers = headers.set('Authorization', 'Bearer ' + token);
  // tslint:disable-next-line:max-line-length
  this.http.post<any>(environment.url + '/api/ConsumerReg', {firstname: data.firstname, lastname: data.lastname, username: data.username, email: data.email, phone: data.phone}, {headers}).subscribe(result => {
      const use = confirm('User is added');
      if (use){
        location.replace('/dashboard/consumerall');
      }
  });
}
  ngOnInit(): void {
  }

}
