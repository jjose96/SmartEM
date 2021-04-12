import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from "../../../environments/environment";
@Component({
  selector: 'app-userpanel',
  templateUrl: './userpanel.component.html',
  styleUrls: ['./userpanel.component.css']
})
export class UserpanelComponent implements OnInit {

  status;
  user;
  constructor(private http: HttpClient) {
    var token=localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer '+token);
    this.http.post<any>(environment.url+'/api/userInfo',{},{headers: headers}).subscribe(result => {
       if (result.status==1){
              this.status=1
              this.user=result.firstname+" "+result.lastname;
             }
      else if(result.status==0){
        this.status=0;
        window.alert("Session expired ! Login again")
        location.replace('/');
      }
      else{}
  });
}


  ngOnInit(): void {
  }

}
