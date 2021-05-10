import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  status = 0;
  user;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/boardInfo', {}, {headers}).subscribe(result => {
              this.status = 1;
              this.user = result.name;
  });
}

OnLogout(){
  localStorage.removeItem('token');
  location.replace('/board');
}
  ngOnInit(): void {

    }


}
