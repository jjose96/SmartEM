import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() {
    // tslint:disable-next-line:only-arrow-functions
    (function()
{
  if ( window.localStorage )
  {
    if ( !localStorage.getItem('firstLoad') )
    {
      localStorage.firstLoad = true;
      window.location.reload();
    }
    else {
      localStorage.removeItem('firstLoad');
    }
  }
})();
  }

  ngOnInit(): void {
  }

}
