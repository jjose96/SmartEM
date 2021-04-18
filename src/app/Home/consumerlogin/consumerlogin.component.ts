import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-consumerlogin',
  templateUrl: './consumerlogin.component.html',
  styleUrls: ['./consumerlogin.component.css']
})
export class ConsumerloginComponent implements OnInit {

  constructor(private http: HttpClient) { }
  state = 1;

  ngOnInit(): void {
  }
  OnSubmit(data){
    this.http.post<any>(environment.url + '/api/login', { username: data.username,
     password: data.password }).subscribe(result => {
      if (result.status === 1){
              localStorage.setItem('token', result.auth);
              location.replace('/userpanel');
            }
            else{
              if (result.status === 0){
                this.state = 0;
              }
            }
  });
}

}