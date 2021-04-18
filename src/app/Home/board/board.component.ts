import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  constructor(private http: HttpClient) {
  }
  ngOnInit(): void {
  }
  state=1;
  OnSubmit(data){
    this.http.post<any>(environment.url+'/api/blogin', { username: data.username,
     password: data.password }).subscribe(result => {
      if (result.status == 1){
              localStorage.setItem('token', result.auth);
              location.replace('/dashboard');
            }
            else{
              if(result.status==0){
                this.state=0
              }
            }
  });
}
}
