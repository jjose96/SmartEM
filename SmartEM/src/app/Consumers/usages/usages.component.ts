import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usages',
  templateUrl: './usages.component.html',
  styleUrls: ['./usages.component.css']
})
export class UsagesComponent implements OnInit {

  constructor() {
    setTimeout(function() {
      $(document).ready(function() {
          new Chart(document.getElementById("chart2"), { "type": "line", "data": { "labels": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], "datasets": [{ "label": "Usage Analysis", "data": [152, 163, 160, 157, 161, 164, 165, 163, 164, 167, 166, 168], "fill": false, "borderColor": "rgb(99, 203, 137)", "lineTension": 0.1 }] }, "options": {} });
      });
  }, 3000);
  }

  ngOnInit(): void {
  }

}
