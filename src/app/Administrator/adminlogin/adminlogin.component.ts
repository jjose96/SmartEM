import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent implements OnInit {
  state = 1;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }
  OnSubmit(data){
    this.http.post<any>(environment.url + '/api/admlogin', { username: data.username,
     password: data.password }).subscribe(result => {
      console.log(result.status);
      // tslint:disable-next-line:triple-equals
      if (result.status == 1){
              console.log(result.status);
              localStorage.setItem('token', result.auth);
              localStorage.setItem('user', 'consumer');
              location.replace('/administrator');
            }
            else{
              // tslint:disable-next-line:triple-equals
              if (result.status == 0){
                this.state = 0;
              }
            }
  });
}

Home(){
  location.replace('/');
  localStorage.removeItem('user');
}
}
