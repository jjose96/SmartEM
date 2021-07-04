import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as $ from 'jquery';
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
  localStorage.removeItem('user');
  location.replace('/board');
}
  ngOnInit(){
    $('.sidebar-dropdown > a').click(function() {
      $('.sidebar-submenu').slideUp(200);
      if (
          $(this)
          .parent()
          .hasClass('active')
      ) {
          $('.sidebar-dropdown').removeClass('active');
          $(this)
              .parent()
              .removeClass('active');
      } else {
          $('.sidebar-dropdown').removeClass('active');
          $(this)
              .next('.sidebar-submenu')
              .slideDown(200);
          $(this)
              .parent()
              .addClass('active');
      }
  });

    // tslint:disable-next-line:only-arrow-functions
    $('#close-sidebar').click(function() {
      $('.page-wrapper').removeClass('toggled');
  });
    // tslint:disable-next-line:only-arrow-functions
    $('#show-sidebar').click(function() {
      $('.page-wrapper').addClass('toggled');
  });

    }


}
