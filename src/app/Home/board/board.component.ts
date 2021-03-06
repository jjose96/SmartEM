import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  state = 1;

  constructor(private http: HttpClient) {
  }
  ngOnInit(): void {
  }
  OnSubmit(data){
    this.http.post<any>(environment.url + '/api/blogin', { username: data.username,
     password: data.password }).subscribe(result => {
      // tslint:disable-next-line:triple-equals
      if (result.status == 1){
              localStorage.setItem('token', result.auth);
              localStorage.setItem('user', 'board');
              location.replace('/dashboard');
            }
            else{
              // tslint:disable-next-line:triple-equals
              if (result.status == 0){
                this.state = 0;
              }
            }
  });
}
}
