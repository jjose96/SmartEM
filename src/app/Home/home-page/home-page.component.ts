import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
state = 1;
  constructor(private http: HttpClient) {
     const user = localStorage.getItem('user');
     if (user === 'consumer'){
       this.state = 0;
       location.replace('/userpanel');
     }
     console.log(this.state);
  }
  ngOnInit(): void {
  }
  OnSubmit(data){
    this.http.post<any>('http://localhost:3000/api/login', { user: data.user,
     pass: data.pass }).subscribe(result => {
  });
}
}
