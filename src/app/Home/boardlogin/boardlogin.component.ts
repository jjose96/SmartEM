import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-boardlogin',
  templateUrl: './boardlogin.component.html',
  styleUrls: ['./boardlogin.component.css']
})
export class BoardloginComponent implements OnInit {

  constructor(private http: HttpClient) {
  }
  state = 1;
  ngOnInit(): void {
  }
  OnSubmit(data){
    this.http.post<any>(environment.url + '/api/blogin', { username: data.username,
     password: data.password }).subscribe(result => {
      if (result.status === 1){
              localStorage.setItem('token', result.auth);
              location.replace('/dashboard');
            }
            else{
              if (result.status === 0){
                this.state = 0;
              }
            }
  });
}

}
