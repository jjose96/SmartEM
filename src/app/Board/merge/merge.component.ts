import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-merge',
  templateUrl: './merge.component.html',
  styleUrls: ['./merge.component.css']
})
export class MergeComponent implements OnInit {
  status;
  user;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    this.http.post<any>(environment.url + '/api/boardInfo', {}, {headers}).subscribe(result => {
       // tslint:disable-next-line:triple-equals
       if (result.status == 1){
              this.status = 1;
              this.user = result.name;
             }
      // tslint:disable-next-line:triple-equals
      else if (result.status == 0){
        this.status = 0;
        window.alert('Session expired ! Login again');
        location.replace('/');
      }
      else{}
  });
}


  ngOnInit(): void {
  }

}
