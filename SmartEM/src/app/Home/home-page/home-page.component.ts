import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
  }
  OnSubmit(data){
    this.http.post<any>('http://localhost:3000/api/login', { user: data.user,
     pass: data.pass }).subscribe(result => {
  });
}
}
