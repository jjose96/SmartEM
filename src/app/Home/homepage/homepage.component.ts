import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
  }
  OnSubmit(data){
    this.http.post<any>('http://localhost:3000/api/login', { user: data.user,
     pass: data.pass }).subscribe(result => {
  });
}
}
